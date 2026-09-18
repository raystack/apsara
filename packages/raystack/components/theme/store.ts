/** Theme persistence: one `localStorage` entry per namespace, merged on write. */

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

// Shared so `useSyncExternalStore`'s `Object.is` check sees one empty answer.
const EMPTY: Partial<ThemeSettings> = Object.freeze({});

// Cached by raw string, so an unchanged entry keeps its identity.
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

// Tolerates any stored shape; `null` when nothing usable is there.
function readEntry(raw: string | null): StoredEntry | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Includes the legacy bare theme name.
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return null;
  }
  const entry = parsed as Partial<StoredEntry>;
  if (typeof entry.v !== 'number') return null;
  if (typeof entry.settings !== 'object' || entry.settings === null)
    return null;
  return { v: entry.v, settings: entry.settings as Record<string, unknown> };
}

// A newer schema reads as empty: this build cannot vouch for its fields.
function parseEntry(raw: string | null): Record<string, unknown> {
  const entry = readEntry(raw);
  if (!entry || entry.v > STORAGE_VERSION) return {};
  return entry.settings;
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
  // Reuse EMPTY so absent and invalid entries compare equal.
  const parsed = Object.keys(settings).length === 0 ? EMPTY : settings;
  snapshotCache.set(persistKey, { raw, parsed });
  return parsed;
}

/** Server snapshot: the seed stands. */
export function readServerSettings(): Partial<ThemeSettings> {
  return EMPTY;
}

/**
 * Merges `patch` into the namespace for the `allowed` keys only. Returns
 * `false` when storage refused the write or already holds a newer schema.
 */
export function writeStoredSettings(
  persistKey: string,
  allowed: readonly ThemeSettingKey[],
  patch: Partial<ThemeSettings>
): boolean {
  if (typeof window === 'undefined') return false;
  const existing = readEntry(readRaw(persistKey));
  // Never downgrade: rewriting a newer entry would destroy what that build owns.
  if (existing && existing.v > STORAGE_VERSION) return false;
  const settings = existing?.settings ?? {};
  let changed = false;
  for (const key of allowed) {
    const next = patch[key];
    if (next === undefined || settings[key] === next) continue;
    settings[key] = next;
    changed = true;
  }
  if (!changed) return true;

  const entry: StoredEntry = { v: STORAGE_VERSION, settings };
  try {
    window.localStorage.setItem(persistKey, JSON.stringify(entry));
  } catch {
    // Quota or disabled storage.
    return false;
  }
  notifyThemeStorage();
  return true;
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

/** Test seam. */
export function clearThemeStorageCache(): void {
  snapshotCache.clear();
}
