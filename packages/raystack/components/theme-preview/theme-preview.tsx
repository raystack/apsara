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
import { flushSync } from 'react-dom';

import {
  RootThemeContext,
  ThemeContext,
  type ThemeContextValue,
  type ThemeHandle,
  useThemeContextOrNull
} from './context';
import { createThemeScript, THEME_ID_ATTRIBUTE } from './script';
import {
  APPEARANCE_CHANGE_ATTRIBUTE,
  assignSetting,
  ROOT_ATTRIBUTE,
  resolveSettings,
  settingsToAttributes,
  THEME_CLASS,
  THEME_DEFAULT_SETTINGS,
  THEME_SETTING_KEYS,
  THEME_SETTING_VALUES,
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
  /** Per-key control. Wins over storage and is never persisted. */
  value?: Partial<ThemeSettings>;
  /**
   * Fires when `setValue` requests a change. Controlled keys are reported but
   * not applied; changes arriving from storage do not fire it.
   */
  onValueChange?: (
    value: ThemeSettings,
    changed: Partial<ThemeSettings>
  ) => void;
  /** Which settings this namespace covers. Defaults to all seven. */
  persist?: readonly ThemeSettingKey[];
  /** Storage namespace. Persistence is off unless this is set. */
  persistKey?: string;
  /** Owns the document colour scheme. Defaults to true with no ancestor theme. */
  isRoot?: boolean;
  /** Overrides the paint heuristic: root or own light/dark appearance paints. */
  hasBackground?: boolean;
  /** Switches appearance with no crossfade, and no component transitions either. */
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

// Precedence: controlled, stored, in-memory, seed, then the parent theme.
function resolvePrecedence(
  inherited: ThemeSettings | undefined,
  controlled: Partial<ThemeSettings> | undefined,
  stored: Partial<ThemeSettings>,
  local: Partial<ThemeSettings>,
  seed: Partial<ThemeSettings> | undefined
): ThemeSettings {
  const next = { ...(inherited ?? THEME_DEFAULT_SETTINGS) };
  for (const key of THEME_SETTING_KEYS) {
    const value = controlled?.[key] ?? stored[key] ?? local[key] ?? seed?.[key];
    if (value !== undefined) assignSetting(next, key, value);
  }
  return next;
}

// Holds identity while contents match; props arrive as fresh literals.
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
      // Classes join, styles merge, refs compose; data attributes stay ours.
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

/** The theme element. Nothing is written to `document.documentElement`. */
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
  // `useId` emits characters invalid in a selector; the script's fallback is one.
  const elementId = useMemo(
    () => `rs-theme-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [reactId]
  );

  // Controlled keys never enter storage or the script.
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

  // Uncontrolled keys outside the namespace.
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
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const disableTransitionRef = useRef(disableTransitionOnChange);
  disableTransitionRef.current = disableTransitionOnChange;

  const setValue = useCallback(
    (next: Partial<ThemeSettings>) => {
      const current = settingsRef.current;
      const changed: Partial<ThemeSettings> = {};
      const patch: Partial<ThemeSettings> = {};
      for (const key of THEME_SETTING_KEYS) {
        const candidate = next[key];
        if (candidate === undefined) continue;
        const allowed: readonly string[] = THEME_SETTING_VALUES[key];
        if (!allowed.includes(candidate) || current[key] === candidate) {
          continue;
        }
        assignSetting(changed, key, candidate);
        // Controlled keys are reported, not applied.
        if (valueRef.current?.[key] !== undefined) continue;
        assignSetting(patch, key, candidate);
      }
      if (isSettingsEmpty(changed)) return;

      const apply = () => {
        if (!isSettingsEmpty(patch)) {
          const persisted = persistedKeysRef.current;
          // A refused write falls back to memory rather than dropping the change.
          const stored =
            persistKey && persisted.length > 0
              ? writeStoredSettings(persistKey, persisted, patch)
              : false;
          const inMemory: Partial<ThemeSettings> = {};
          for (const key of THEME_SETTING_KEYS) {
            const pending = patch[key];
            if (pending === undefined) continue;
            if (stored && persisted.includes(key)) continue;
            assignSetting(inMemory, key, pending);
          }
          if (!isSettingsEmpty(inMemory)) {
            setLocal(previous => ({ ...previous, ...inMemory }));
          }
        }

        // From the request, not settled state, so hydration never fires it.
        onValueChangeRef.current?.({ ...current, ...changed }, changed);
      };

      // An appearance swap repaints the page; anything else is a local change.
      if (changed.appearance === undefined || disableTransitionRef.current) {
        apply();
        return;
      }
      crossfadeAppearance(apply, resolvedRef.current.reducedMotion);
    },
    [persistKey]
  );

  const handle = useMemo<ThemeHandle>(
    () => ({ value: settings, resolved, setValue, systemAppearance }),
    [settings, resolved, setValue, systemAppearance]
  );
  const context = useMemo<ThemeContextValue>(
    () => ({ ...handle, isRoot: isRootTheme }),
    [handle, isRootTheme]
  );

  // Only a root publishes itself, so a scope can flip the page.
  const inheritedRoot = useContext(RootThemeContext);
  const rootHandle = isRootTheme ? handle : (inheritedRoot ?? handle);

  // Own appearance from any source; inherited keys do not count.
  const ownAppearance =
    value?.appearance ??
    stored.appearance ??
    local.appearance ??
    defaultValue?.appearance;
  const paints =
    hasBackground ??
    (isRootTheme ||
      (ownAppearance !== undefined && ownAppearance !== 'system'));

  useAppearanceTransition(
    resolved.appearance,
    disableTransitionOnChange,
    nonce
  );

  // What the server rendered from, before storage is consulted.
  const seed = useStableSettings(
    resolvePrecedence(
      parent?.value,
      value,
      EMPTY_PATCH,
      EMPTY_PATCH,
      defaultValue
    )
  );
  const script = useMemo(
    () =>
      createThemeScript({ persistKey, keys: persistedKeys, seed, elementId }),
    [persistKey, persistedKeys, seed, elementId]
  );

  const elementRef = useRef<HTMLElement | null>(null);
  const attributes = useMemo(() => settingsToAttributes(resolved), [resolved]);

  // Where no script ran, the server's guess survives hydration silently;
  // one reconciliation on mount closes that.
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
          // First child, so it patches the parent before any child is parsed.
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

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function prefersReducedMotion(setting: string): boolean {
  if (setting === 'true') return true;
  if (setting === 'false') return false;
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}

/**
 * A theme switch repaints far more than the elements that own a transition, so
 * left alone a page arrives in waves — controls at 200ms, everything else on the
 * next frame. A view transition crossfades one snapshot of the page instead, so
 * all of it lands on the same clock; `theme.css` gives that crossfade the same
 * duration and easing the components use.
 *
 * The attribute scopes those rules to this transition, and `flushSync` puts the
 * new attributes in the DOM while the snapshot is still being captured.
 */
function crossfadeAppearance(apply: () => void, reducedMotion: string): void {
  if (typeof document === 'undefined') {
    apply();
    return;
  }
  const doc = document as ViewTransitionDocument;
  if (!doc.startViewTransition || prefersReducedMotion(reducedMotion)) {
    apply();
    return;
  }

  const root = document.documentElement;
  root.setAttribute(APPEARANCE_CHANGE_ATTRIBUTE, '');
  const transition = doc.startViewTransition(() => {
    flushSync(apply);
  });
  // A skipped transition rejects; the attribute still has to come off.
  transition.finished
    .catch(() => undefined)
    .finally(() => root.removeAttribute(APPEARANCE_CHANGE_ATTRIBUTE));
}

/**
 * Covers the changes `setValue` never sees — the OS flipping under `system`,
 * another tab writing storage — and suppresses motion entirely when that is what
 * was asked for. Those arrive mid-render, too late to capture a snapshot from,
 * so they take the components' own transitions rather than a crossfade.
 */
function useAppearanceTransition(
  appearance: string,
  disabled: boolean,
  nonce: string | undefined
): void {
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const last = previous.current;
    previous.current = appearance;
    if (!disabled || last === null || last === appearance) return;
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    if (nonce) style.setAttribute('nonce', nonce);
    style.appendChild(
      document.createTextNode(
        '*,*::before,*::after{transition:none!important;animation:none!important}'
      )
    );
    document.head.appendChild(style);
    // Reflow so the suppression lands before the swap paints.
    void window.getComputedStyle(document.body).opacity;
    const timer = window.setTimeout(() => style.remove(), 1);
    return () => {
      window.clearTimeout(timer);
      style.remove();
    };
  }, [appearance, disabled, nonce]);
}
