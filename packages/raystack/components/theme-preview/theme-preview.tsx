'use client';

import { cx } from 'class-variance-authority';
import {
  type CSSProperties,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';

import {
  RootThemeContext,
  ThemeContext,
  type ThemeContextValue,
  type ThemeHandle,
  useThemeContextOrNull
} from './context';
import { createThemeScript, THEME_ID_ATTRIBUTE } from './script';
import {
  assignSetting,
  DEFAULT_SETTINGS,
  ROOT_ATTRIBUTE,
  resolveSettings,
  SETTING_VALUES,
  settingsToAttributes,
  THEME_CLASS,
  THEME_SETTING_KEYS,
  type ThemeSettingKey,
  type ThemeSettings
} from './settings';
import {
  readServerSettings,
  readStoredSettings,
  subscribeToThemeStorage,
  writeStoredSettings
} from './store';
import { useSystemAppearance } from './use-system-appearance';

/** `asChild`-style escape hatch for the mount element. */
export type ThemeRenderProp =
  | ReactElement<Record<string, unknown>>
  | ((props: Record<string, unknown>) => ReactElement);

export interface ThemePreviewProps
  extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
  /** Seeds uncontrolled keys. A stored user choice overrides it. */
  defaultValue?: Partial<ThemeSettings>;
  /**
   * Controlled keys always win, are never persisted and are never written by
   * the inline script. Control is per key.
   */
  value?: Partial<ThemeSettings>;
  /** Fires with the full next settings object and the changed subset. */
  onValueChange?: (
    value: ThemeSettings,
    changed: Partial<ThemeSettings>
  ) => void;
  /** Which settings this namespace covers. Defaults to all seven. */
  persist?: readonly ThemeSettingKey[];
  /** Storage namespace. Persistence is off unless this is set. */
  persistKey?: string;
  /**
   * Whether this theme owns the document's colour scheme. Defaults to true
   * when there is no ancestor theme; an embedded widget that has no ancestor
   * but does not own the page must pass `false`.
   */
  isRoot?: boolean;
  /**
   * Overrides the painting heuristic: true at the root, true for a nested theme
   * that sets an explicit `light` or `dark` appearance, false otherwise.
   */
  hasBackground?: boolean;
  /** Suppresses the colour transition during an appearance switch. */
  disableTransitionOnChange?: boolean;
  /** CSP nonce for the inline script. */
  nonce?: string;
  /** Replaces the mount element, merging the theme's props onto it. */
  render?: ThemeRenderProp;
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  children?: ReactNode;
}

const NO_KEYS: readonly ThemeSettingKey[] = [];
const EMPTY_PATCH: Partial<ThemeSettings> = {};

/** Keeps only the keys `allowed` covers. */
function pickSettings(
  source: Partial<ThemeSettings>,
  allowed: readonly ThemeSettingKey[]
): Partial<ThemeSettings> {
  const out: Partial<ThemeSettings> = {};
  for (const key of allowed) {
    const value = source[key];
    if (value !== undefined) assignSetting(out, key, value);
  }
  return out;
}

function isSettingsEmpty(patch: Partial<ThemeSettings>): boolean {
  for (const key of THEME_SETTING_KEYS) {
    if (patch[key] !== undefined) return false;
  }
  return true;
}

/**
 * Per-key precedence: controlled, then stored, then in-memory, then the seed,
 * and finally the parent theme. A nested theme therefore inherits every key it
 * does not set, which is how "inherit" is expressed — by omission.
 */
function resolvePrecedence(
  inherited: ThemeSettings | undefined,
  controlled: Partial<ThemeSettings> | undefined,
  stored: Partial<ThemeSettings>,
  local: Partial<ThemeSettings>,
  seed: Partial<ThemeSettings> | undefined
): ThemeSettings {
  const next = { ...(inherited ?? DEFAULT_SETTINGS) };
  for (const key of THEME_SETTING_KEYS) {
    const value = controlled?.[key] ?? stored[key] ?? local[key] ?? seed?.[key];
    if (value !== undefined) assignSetting(next, key, value);
  }
  return next;
}

/**
 * Holds identity stable while the contents are unchanged. A dependency list
 * over `value`, `defaultValue` and `persist` cannot work, because those are
 * naturally written as fresh object literals on every render.
 */
function useStableSettings(next: ThemeSettings): ThemeSettings {
  const held = useRef(next);
  for (const key of THEME_SETTING_KEYS) {
    if (held.current[key] !== next[key]) {
      held.current = next;
      break;
    }
  }
  return held.current;
}

/** The same, for the persisted-key list. */
function useStableKeys(
  next: readonly ThemeSettingKey[]
): readonly ThemeSettingKey[] {
  const held = useRef(next);
  const current = held.current;
  if (
    current.length !== next.length ||
    current.some((key, index) => key !== next[index])
  ) {
    held.current = next;
  }
  return held.current;
}

/** Merges the theme's props onto a caller-supplied element. */
function renderThemeElement(
  render: ThemeRenderProp | undefined,
  props: Record<string, unknown>
): ReactElement {
  if (typeof render === 'function') return render(props);
  if (isValidElement(render)) {
    const own = render.props as Record<string, unknown>;
    return cloneElement(render, {
      ...props,
      ...own,
      // The theme's identity must survive whatever the supplied element sets:
      // classes join, styles merge, both refs fire, the children are the
      // theme's, and the data attributes are not overwritable.
      className: cx(props.className as string, own.className as string),
      style: {
        ...(props.style as CSSProperties),
        ...(own.style as CSSProperties)
      },
      ref: composeRefs(props.ref as Ref<HTMLElement>, own.ref as Ref<unknown>),
      children: props.children,
      ...protectedProps(props)
    });
  }
  return <div {...(props as HTMLAttributes<HTMLDivElement>)} />;
}

/** Calls both refs, so a `render` target keeps its own. */
function composeRefs(
  ours: Ref<HTMLElement>,
  theirs: Ref<unknown>
): Ref<HTMLElement> {
  if (!theirs) return ours;
  return (node: HTMLElement | null) => {
    if (typeof ours === 'function') ours(node);
    else if (ours) (ours as { current: HTMLElement | null }).current = node;
    if (typeof theirs === 'function') theirs(node);
    else if (theirs) (theirs as { current: unknown }).current = node;
  };
}

/** The prop subset a `render` target may not override. */
function protectedProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (key.startsWith('data-') || key === 'suppressHydrationWarning') {
      out[key] = props[key];
    }
  }
  return out;
}

/**
 * The theme.
 *
 * Every token-bearing attribute lives on the element this renders, so the root
 * theme, a nested scope and a portal re-injection are the same component
 * rendering the same attributes; only their defaults and background behaviour
 * differ. Nothing is written to `document.documentElement`.
 */
export function ThemePreview({
  defaultValue,
  value,
  onValueChange,
  persist,
  persistKey,
  isRoot,
  hasBackground,
  disableTransitionOnChange = false,
  nonce,
  render,
  className,
  children,
  ref,
  ...props
}: ThemePreviewProps) {
  const parent = useThemeContextOrNull();
  const isRootTheme = isRoot ?? parent === null;

  const reactId = useId();
  // `useId` returns colons and guillemets that are not valid unescaped in a
  // selector, and the script's fallback lookup is a selector.
  const elementId = useMemo(
    () => `rs-theme-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [reactId]
  );

  // Controlled keys are excluded from the namespace a write touches and from
  // the script's key list: stale storage must never shadow them.
  const persistedKeys = useStableKeys(
    persistKey
      ? (persist ?? THEME_SETTING_KEYS).filter(
          key => value?.[key] === undefined
        )
      : NO_KEYS
  );

  const getSnapshot = useCallback(
    () => readStoredSettings(persistKey),
    [persistKey]
  );
  const rawStored = useSyncExternalStore(
    subscribeToThemeStorage,
    getSnapshot,
    readServerSettings
  );
  const stored = useMemo(
    () => pickSettings(rawStored, persistedKeys),
    [rawStored, persistedKeys]
  );

  /** Uncontrolled keys the namespace does not cover live here instead. */
  const [local, setLocal] = useState<Partial<ThemeSettings>>(EMPTY_PATCH);

  const systemAppearance = useSystemAppearance();

  const settings = useStableSettings(
    resolvePrecedence(parent?.value, value, stored, local, defaultValue)
  );

  const resolved = useMemo(
    () => resolveSettings(settings, systemAppearance),
    [settings, systemAppearance]
  );

  const valueRef = useRef(value);
  valueRef.current = value;
  const persistedKeysRef = useRef(persistedKeys);
  persistedKeysRef.current = persistedKeys;

  const setValue = useCallback(
    (next: Partial<ThemeSettings>) => {
      const patch: Partial<ThemeSettings> = {};
      for (const key of THEME_SETTING_KEYS) {
        const candidate = next[key];
        if (candidate === undefined) continue;
        // Controlled keys are ignored rather than throwing, so a switcher that
        // does not know which keys a page controls stays usable.
        if (valueRef.current?.[key] !== undefined) continue;
        const allowed: readonly string[] = SETTING_VALUES[key];
        if (!allowed.includes(candidate)) continue;
        assignSetting(patch, key, candidate);
      }
      if (isSettingsEmpty(patch)) return;

      const persisted = persistedKeysRef.current;
      if (persistKey && persisted.length > 0) {
        writeStoredSettings(persistKey, persisted, patch);
      }
      const inMemory: Partial<ThemeSettings> = {};
      for (const key of THEME_SETTING_KEYS) {
        const pending = patch[key];
        if (pending === undefined || persisted.includes(key)) continue;
        assignSetting(inMemory, key, pending);
      }
      if (!isSettingsEmpty(inMemory)) {
        setLocal(previous => ({ ...previous, ...inMemory }));
      }
    },
    [persistKey]
  );

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const previousSettings = useRef<ThemeSettings | null>(null);

  useEffect(() => {
    const previous = previousSettings.current;
    previousSettings.current = settings;
    if (!previous) return;
    const changed: Partial<ThemeSettings> = {};
    for (const key of THEME_SETTING_KEYS) {
      if (previous[key] !== settings[key]) {
        assignSetting(changed, key, settings[key]);
      }
    }
    if (!isSettingsEmpty(changed))
      onValueChangeRef.current?.(settings, changed);
  }, [settings]);

  const handle = useMemo<ThemeHandle>(
    () => ({ value: settings, resolved, setValue, systemAppearance }),
    [settings, resolved, setValue, systemAppearance]
  );
  const context = useMemo<ThemeContextValue>(
    () => ({ ...handle, isRoot: isRootTheme }),
    [handle, isRootTheme]
  );

  // Only a root publishes itself, which is what lets a scope flip the page.
  const inheritedRoot = useContext(RootThemeContext);
  const rootHandle = isRootTheme ? handle : (inheritedRoot ?? handle);

  const explicitAppearance = value?.appearance ?? defaultValue?.appearance;
  const paints =
    hasBackground ??
    (isRootTheme ||
      (explicitAppearance !== undefined && explicitAppearance !== 'system'));

  useAppearanceTransitionGuard(
    resolved.appearance,
    disableTransitionOnChange,
    nonce
  );

  const script = useMemo(
    () =>
      persistKey
        ? createThemeScript({ persistKey, keys: persistedKeys, elementId })
        : null,
    [persistKey, persistedKeys, elementId]
  );

  const elementRef = useRef<HTMLElement | null>(null);
  const attributes = useMemo(() => settingsToAttributes(resolved), [resolved]);

  // React only warns about hydration attribute mismatches, and
  // `suppressHydrationWarning` silences even that, so where no inline script
  // ran the server's guess can survive in the DOM. One imperative
  // reconciliation on mount closes that gap; elsewhere it is a no-op.
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    for (const [name, attributeValue] of Object.entries(attributes)) {
      if (element.getAttribute(name) !== attributeValue) {
        element.setAttribute(name, attributeValue);
      }
    }
  }, [attributes]);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLElement | null }).current = node;
    },
    [ref]
  );

  const elementProps: Record<string, unknown> = {
    ...props,
    ref: setRef,
    className: cx(THEME_CLASS, className),
    ...attributes,
    [ROOT_ATTRIBUTE]: isRootTheme ? '' : undefined,
    'data-rs-background': paints ? '' : undefined,
    [THEME_ID_ATTRIBUTE]: script ? elementId : undefined,
    'data-slot': 'theme-preview',
    suppressHydrationWarning: true,
    children: (
      <>
        {script ? (
          // First child, so it patches its parent's attributes before any
          // child content is parsed. The source is generated from a closed
          // configuration with every interpolated value escaped.
          <script
            data-slot='theme-preview-script'
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ) : null}
        {children}
      </>
    )
  };

  const element = renderThemeElement(render, elementProps);

  return (
    <ThemeContext.Provider value={context}>
      {isRootTheme ? (
        <RootThemeContext.Provider value={rootHandle}>
          {element}
        </RootThemeContext.Provider>
      ) : (
        element
      )}
    </ThemeContext.Provider>
  );
}

ThemePreview.displayName = 'ThemePreview';

/**
 * Suppresses the deliberate 0.4s colour transition on themed elements while an
 * appearance switch lands, so the change does not sweep across the page.
 */
function useAppearanceTransitionGuard(
  appearance: string,
  enabled: boolean,
  nonce: string | undefined
): void {
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const last = previous.current;
    previous.current = appearance;
    if (!enabled || last === null || last === appearance) return;
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    if (nonce) style.setAttribute('nonce', nonce);
    style.appendChild(
      document.createTextNode(
        '*,*::before,*::after{transition:none!important;animation:none!important}'
      )
    );
    document.head.appendChild(style);
    // Force a reflow so the suppression lands before the swap is painted, then
    // drop it on the next tick.
    void window.getComputedStyle(document.body).opacity;
    const timer = window.setTimeout(() => style.remove(), 1);
    return () => {
      window.clearTimeout(timer);
      style.remove();
    };
  }, [appearance, enabled, nonce]);
}
