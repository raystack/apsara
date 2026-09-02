/**
 * Theme persistence. A namespace is one `localStorage` entry holding one JSON
 * object: the settings it covers, alongside a schema version. Two themes may
 * share a namespace deliberately, so a write merges rather than replaces.
 */

import {
  STORAGE_VERSION,
  sanitizeSettings,
  type ThemeSettingKey,
  type ThemeSettings
} from './settings';

/** A `storage` event does not fire in the document that produced the write. */
export const THEME_STORAGE_EVENT = 'rs-theme-storage';

interface StoredEntry {
  v: number;
  settings: Record<string, unknown>;
}

/**
 * Stable empty result. `useSyncExternalStore` compares with `Object.is` and
 * accepts no equality function, so every "nothing stored" answer must be the
 * same object or the component re-renders without end.
 */
const EMPTY: Partial<ThemeSettings> = Object.freeze({});

/** Parsed settings cached against the raw string they came from. */
const snapshotCache = new Map<
  string,
  { raw: string | null; parsed: Partial<ThemeSettings> }
>();

function noop(): void {
  /* nothing to clean up */
}

function readRaw(persistKey: string): string | null {
  try {
    return window.localStorage.getItem(persistKey);
  } catch {
    // Private mode, disabled storage, or a cross-origin sandbox.
    return null;
  }
}

/** Reads the settings object out of an entry, tolerating anything at all. */
function parseEntry(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Includes the legacy `"dark"` bare theme name, which is not an object.
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  const entry = parsed as Partial<StoredEntry>;
  if (typeof entry.v !== 'number' || entry.v > STORAGE_VERSION) return {};
  if (typeof entry.settings !== 'object' || entry.settings === null) return {};
  return entry.settings as Record<string, unknown>;
}

/** The client snapshot, identity-stable while the stored string is unchanged. */
export function readStoredSettings(
  persistKey: string | undefined
): Partial<ThemeSettings> {
  if (!persistKey || typeof window === 'undefined') return EMPTY;
  const raw = readRaw(persistKey);
  const cached = snapshotCache.get(persistKey);
  if (cached && cached.raw === raw) return cached.parsed;
  const settings = sanitizeSettings(parseEntry(raw));
  // Keep the frozen singleton when nothing survived, so an absent entry and a
  // fully-invalid one both compare equal across renders.
  const parsed = Object.keys(settings).length === 0 ? EMPTY : settings;
  snapshotCache.set(persistKey, { raw, parsed });
  return parsed;
}

/** The server snapshot. There is no storage, so the seed stands. */
export function readServerSettings(): Partial<ThemeSettings> {
  return EMPTY;
}

/**
 * Merges `patch` into the namespace, applying only the settings `allowed`
 * covers. Fields outside it survive untouched, including ones owned by a theme
 * with a different `persist` on the same namespace.
 */
export function writeStoredSettings(
  persistKey: string,
  allowed: readonly ThemeSettingKey[],
  patch: Partial<ThemeSettings>
): void {
  if (typeof window === 'undefined') return;
  const settings = parseEntry(readRaw(persistKey));
  let changed = false;
  for (const key of allowed) {
    const next = patch[key];
    if (next === undefined || settings[key] === next) continue;
    settings[key] = next;
    changed = true;
  }
  if (!changed) return;

  const entry: StoredEntry = { v: STORAGE_VERSION, settings };
  try {
    window.localStorage.setItem(persistKey, JSON.stringify(entry));
  } catch {
    // Quota or disabled storage.
  }
  notifyThemeStorage();
}

/** Wakes every reader in this document. Other tabs get the `storage` event. */
export function notifyThemeStorage(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
}

/** `storage` covers other tabs; the in-document event covers this page. */
export function subscribeToThemeStorage(onChange: () => void): () => void {
  if (typeof window === 'undefined') return noop;
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_STORAGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_STORAGE_EVENT, onChange);
  };
}

/** Test seam. Drops the parsed-snapshot cache. */
export function clearThemeStorageCache(): void {
  snapshotCache.clear();
}
