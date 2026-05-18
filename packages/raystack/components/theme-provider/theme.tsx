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

const Scoped = ({
  forcedTheme,
  accentColor,
  grayColor,
  style,
  children
}: ThemeProviderProps) => (
  <div
    data-theme={forcedTheme}
    data-accent-color={accentColor}
    data-gray-color={grayColor}
    data-style={style}
  >
    {children}
  </div>
);

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
    (theme: string) => {
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
