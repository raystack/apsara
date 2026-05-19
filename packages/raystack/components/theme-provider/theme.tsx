'use client';

import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import type { ThemeProviderProps, UseThemeProps } from './types';
import { COLOR_SCHEMES } from './types';

const colorSchemes: string[] = [...COLOR_SCHEMES];
const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';
const ThemeContext = createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = { setTheme: _ => {}, themes: [] };

export const useTheme = () => useContext(ThemeContext) ?? defaultContext;

export function Theme(props: ThemeProviderProps) {
  const context = useContext(ThemeContext);

  // Nested usage: scoped subtree. Render a wrapper element that overrides
  // theme tokens locally via `data-*` attributes; the parent provider's
  // global state remains the source of truth for descendants reading
  // `useTheme()`.
  if (context) return <Scoped {...props} />;
  return <Root {...props} />;
}

Theme.displayName = 'Theme';

/**
 * @deprecated Use `Theme` instead. `ThemeProvider` is kept as an alias for
 * backward compatibility and will be removed in a future major release.
 */
export const ThemeProvider = Theme;

const Scoped = (props: ThemeProviderProps) =>
  props.storageKey ? (
    <PersistedScope {...props} />
  ) : (
    <StatelessScope {...props} />
  );

const StatelessScope = ({
  forcedTheme,
  accentColor,
  grayColor,
  style,
  children
}: ThemeProviderProps) => {
  const parent = useContext(ThemeContext);
  const hasOverrides = !!(forcedTheme || accentColor || grayColor || style);

  // Layer scope overrides on top of the parent's context so `useTheme()`
  // inside the scope sees the effective values. When no overrides are
  // passed, return parent unchanged so the early-return below skips the
  // wrapper entirely (preserves the pre-PR no-op behavior).
  const layered = useMemo<UseThemeProps | undefined>(
    () =>
      !parent || !hasOverrides
        ? parent
        : {
            ...parent,
            forcedTheme: forcedTheme ?? parent.forcedTheme,
            resolvedTheme: forcedTheme ?? parent.resolvedTheme,
            style: style ?? parent.style,
            accentColor: accentColor ?? parent.accentColor,
            grayColor: grayColor ?? parent.grayColor
          },
    [parent, hasOverrides, forcedTheme, style, accentColor, grayColor]
  );

  // No-op nesting: pass children through without a wrapper or new provider.
  // Avoids the extra DOM node and the redundant context propagation when a
  // consumer renders `<Theme>` inside another `<Theme>` without overrides.
  if (!hasOverrides) return <>{children}</>;

  return (
    <ThemeContext value={layered}>
      <div
        data-theme={forcedTheme}
        data-accent-color={accentColor}
        data-gray-color={grayColor}
        data-style={style}
      >
        {children}
      </div>
    </ThemeContext>
  );
};

StatelessScope.displayName = 'Theme.StatelessScope';

const readScopeStorage = (key: string): string | undefined => {
  if (isServer) return undefined;
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

const PersistedScope = ({
  storageKey,
  defaultTheme,
  forcedTheme,
  accentColor,
  grayColor,
  style,
  children
}: ThemeProviderProps) => {
  // `storageKey!` is safe: the chooser only routes here when defined.
  const key = storageKey as string;
  const parent = useContext(ThemeContext);

  const [stored, setStored] = useState<string | undefined>(
    () => readScopeStorage(key) ?? defaultTheme
  );

  // Re-sync if the storageKey itself changes mid-life.
  useEffect(() => {
    setStored(readScopeStorage(key) ?? defaultTheme);
    // defaultTheme is the seed only when storage is empty; intentionally
    // excluded from deps to avoid re-applying it on prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist on change; clear when unset. Compare against the current
  // storage value first so initial mounts (and StrictMode double-effects)
  // don't write back what we just read or fire spurious storage events to
  // other tabs.
  useEffect(() => {
    try {
      const current = localStorage.getItem(key);
      if (stored === undefined) {
        if (current !== null) localStorage.removeItem(key);
      } else if (current !== stored) {
        localStorage.setItem(key, stored);
      }
    } catch {
      // unsupported (private mode, quota exceeded)
    }
  }, [key, stored]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setStored(e.newValue ?? undefined);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  // forcedTheme wins for display but is NOT persisted — it's a developer
  // override, not a user choice.
  const displayed = forcedTheme ?? stored;

  // Override theme + setTheme to point at this scope's state, inherit the
  // rest from the parent (themes list, systemTheme, etc.).
  const layered = useMemo<UseThemeProps | undefined>(
    () =>
      parent && {
        ...parent,
        theme: stored,
        setTheme: setStored,
        forcedTheme: forcedTheme ?? parent.forcedTheme,
        resolvedTheme: displayed ?? parent.resolvedTheme,
        style: style ?? parent.style,
        accentColor: accentColor ?? parent.accentColor,
        grayColor: grayColor ?? parent.grayColor
      },
    [parent, stored, displayed, forcedTheme, style, accentColor, grayColor]
  );

  return (
    <ThemeContext value={layered}>
      <div
        data-theme={displayed}
        data-accent-color={accentColor}
        data-gray-color={grayColor}
        data-style={style}
      >
        {children}
      </div>
    </ThemeContext>
  );
};

PersistedScope.displayName = 'Theme.PersistedScope';

const defaultThemes: string[] = [...COLOR_SCHEMES];

const Root = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = defaultThemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
  children,
  nonce,
  style = 'modern',
  accentColor = 'indigo',
  grayColor = 'gray',
  onThemeChange
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme)
  );
  const [resolvedTheme, setResolvedTheme] = useState<string | undefined>(
    undefined
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string | undefined) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      if (attribute === 'class') {
        d.classList.remove(...attrs);

        if (name) d.classList.add(name);
      } else {
        if (name) {
          d.setAttribute(attribute, name);
        } else {
          d.removeAttribute(attribute);
        }
      }

      d.setAttribute('data-style', style);
      d.setAttribute('data-accent-color', accentColor);
      d.setAttribute('data-gray-color', grayColor);

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : null;
        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;
        d.style.colorScheme = colorScheme ?? '';
      }

      enable?.();
    },
    [
      style,
      accentColor,
      grayColor,
      attribute,
      attrs,
      value,
      enableSystem,
      enableColorScheme,
      defaultTheme
    ]
  );

  const setTheme = useCallback(
    (theme: string | undefined) => {
      // Root has no parent to inherit from, so `undefined` is a no-op here.
      // (Persistent scopes use `undefined` to clear and re-inherit.)
      if (theme === undefined) return;
      setThemeState(theme);

      // Save to storage
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        // Unsupported
      }
    },
    [storageKey]
  );

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    [theme, forcedTheme, enableSystem, applyTheme]
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    media.addEventListener('change', handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeEventListener('change', handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme]);

  // Ref-held callback so consumer render churn doesn't drive effect cadence.
  const onThemeChangeRef = useRef(onThemeChange);
  onThemeChangeRef.current = onThemeChange;
  const lastRef = useRef<{ theme: string; resolved: string } | undefined>(
    undefined
  );

  // Apply on theme/forcedTheme change, then notify on real changes.
  useEffect(() => {
    const target = forcedTheme ?? theme;
    if (target) applyTheme(target);

    if (!theme) return;
    const resolved =
      forcedTheme ?? (theme === 'system' ? resolvedTheme : theme);
    if (!resolved) return;

    const prev = lastRef.current;
    lastRef.current = { theme, resolved };

    if (
      prev !== undefined &&
      (prev.theme !== theme || prev.resolved !== resolved)
    ) {
      onThemeChangeRef.current?.(theme, resolved);
    }
  }, [forcedTheme, theme, resolvedTheme, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme:
        forcedTheme ?? (theme === 'system' ? resolvedTheme : theme),
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | 'light'
        | 'dark'
        | undefined,
      style,
      accentColor,
      grayColor
    }),
    [
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme,
      enableSystem,
      themes,
      style,
      accentColor,
      grayColor
    ]
  );

  return (
    <ThemeContext value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          storageKey,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          attrs,
          nonce,
          style,
          accentColor,
          grayColor
        }}
      />
      {children}
    </ThemeContext>
  );
};

Root.displayName = 'Theme.Root';

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    attrs,
    nonce,
    style,
    accentColor,
    grayColor
  }: ThemeProviderProps & { attrs: string[]; defaultTheme: string }) => {
    const defaultSystem = defaultTheme === 'system';

    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === 'class') {
        const removeClasses = `c.remove(${attrs
          .map((t: string) => `'${t}'`)
          .join(',')})`;

        return `var d=document.documentElement,c=d.classList;${removeClasses};`;
      } else {
        return `var d=document.documentElement,n='${attribute}',s='setAttribute';`;
      }
    })();

    const fallbackColorScheme = (() => {
      if (!enableColorScheme) {
        return '';
      }

      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;

      if (fallback) {
        return `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${defaultTheme}'`;
      } else {
        return `if(e==='light'||e==='dark')d.style.colorScheme=e`;
      }
    })();

    const updateDOM = (
      name: string,
      literal: boolean = false,
      setColorScheme = true
    ) => {
      const resolvedName = value ? value[name] : name;
      const val = literal ? name : `'${resolvedName}'`;
      let text = '';

      // MUCH faster to set colorScheme alongside HTML attribute/class
      // as it only incurs 1 style recalculation rather than 2
      // This can save over 250ms of work for pages with big DOM
      if (
        enableColorScheme &&
        setColorScheme &&
        !literal &&
        colorSchemes.includes(name)
      ) {
        text += `d.style.colorScheme = '${name}';`;
      }

      if (attribute === 'class') {
        if (literal) {
          text += `if(${val})c.add(${val})`;
        } else if (resolvedName) {
          text += `c.add(${val})`;
        } else {
          text += `null`;
        }
      } else {
        if (literal) {
          text += `if(${val})d[s](n,${val})`;
        } else if (resolvedName) {
          text += `d[s](n,${val})`;
        }
      }

      return text;
    };

    const scriptSrc = (() => {
      if (forcedTheme) {
        return `!function(){${optimization}${updateDOM(forcedTheme)};d.setAttribute('data-style','${style}');d.setAttribute('data-accent-color','${accentColor}');d.setAttribute('data-gray-color','${grayColor}');}()`;
      }

      if (enableSystem) {
        return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if('system'===e||(!e&&${defaultSystem})){var t='${MEDIA}',m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
          'dark'
        )}}else{${updateDOM('light')}}}else if(e){${
          value ? `var x=${JSON.stringify(value)};` : ''
        }${updateDOM(value ? `x[e]` : 'e', true)}}${
          !defaultSystem
            ? `else{` + updateDOM(defaultTheme, false, false) + '}'
            : ''
        }${fallbackColorScheme};d.setAttribute('data-style','${style}');d.setAttribute('data-accent-color','${accentColor}');d.setAttribute('data-gray-color','${grayColor}');}catch(e){}}()`;
      }

      return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if(e){${
        value ? `var x=${JSON.stringify(value)};` : ''
      }${updateDOM(value ? `x[e]` : 'e', true)}}else{${updateDOM(
        defaultTheme,
        false,
        false
      )};}${fallbackColorScheme};d.setAttribute('data-style','${style}');d.setAttribute('data-accent-color','${accentColor}');d.setAttribute('data-gray-color','${grayColor}');}catch(t){}}();`;
    })();

    return (
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: scriptSrc }} />
    );
  },
  // Never re-render this component
  () => true
);

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

const disableAnimation = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
