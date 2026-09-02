import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * A real in-memory `localStorage`. The theme round-trips JSON through it, so a
 * mock that only records calls cannot exercise the merge or the cache.
 */
export function installLocalStorage(): Map<string, string> {
  const entries = new Map<string, string>();
  const storage: Storage = {
    getItem: key => (entries.has(key) ? (entries.get(key) as string) : null),
    setItem: (key, value) => {
      entries.set(key, String(value));
    },
    removeItem: key => {
      entries.delete(key);
    },
    clear: () => entries.clear(),
    key: index => Array.from(entries.keys())[index] ?? null,
    get length() {
      return entries.size;
    }
  };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: storage
  });
  return entries;
}

type MediaListener = (event: MediaQueryListEvent) => void;

export interface MediaController {
  /** Flips what the OS reports and notifies every listener. */
  setPrefersDark: (next: boolean) => void;
  matchMedia: ReturnType<typeof vi.fn>;
}

/** jsdom ships no `matchMedia`; the theme needs one that can change. */
export function installMatchMedia(initialDark = false): MediaController {
  let prefersDark = initialDark;
  const listeners = new Set<MediaListener>();

  const matchMedia = vi.fn((query: string) => ({
    get matches() {
      return query.includes('dark') ? prefersDark : false;
    },
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_type: string, listener: MediaListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: MediaListener) => {
      listeners.delete(listener);
    },
    dispatchEvent: vi.fn()
  }));

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia
  });

  return {
    matchMedia,
    setPrefersDark: next => {
      prefersDark = next;
      act(() => {
        for (const listener of listeners) {
          listener({ matches: next } as MediaQueryListEvent);
        }
      });
    }
  };
}

/** Serialises a settings object the way the theme stores it. */
export function storedEntry(
  settings: Record<string, unknown>,
  version = 1
): string {
  return JSON.stringify({ v: version, settings });
}
