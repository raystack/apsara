import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearThemeStorageCache,
  readServerSettings,
  readStoredSettings,
  subscribeToThemeStorage,
  THEME_STORAGE_EVENT,
  writeStoredSettings
} from '../store';
import {
  installLocalStorage,
  installThrowingLocalStorage,
  storedEntry
} from './mocks';

let entries: Map<string, string>;

beforeEach(() => {
  entries = installLocalStorage();
  clearThemeStorageCache();
});

describe('readStoredSettings', () => {
  it('reads the settings a namespace holds', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'large' }));
    expect(readStoredSettings('app')).toEqual({
      appearance: 'dark',
      radius: 'large'
    });
  });

  it('returns nothing without a persistKey, and never touches storage', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    expect(readStoredSettings(undefined)).toEqual({});
  });

  it('falls back to the seed when the entry is missing', () => {
    expect(readStoredSettings('app')).toEqual({});
  });

  it('falls back to the seed when the entry is unparseable', () => {
    entries.set('app', '{not json');
    expect(readStoredSettings('app')).toEqual({});
  });

  it('falls back to the seed for a bare legacy theme name', () => {
    // The old provider stored `"dark"`: valid JSON, not an object, so detectable.
    entries.set('app', JSON.stringify('dark'));
    expect(readStoredSettings('app')).toEqual({});
  });

  it('ignores an entry written by a newer schema version', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }, 99));
    expect(readStoredSettings('app')).toEqual({});
  });

  it('discards an out-of-union field individually', () => {
    entries.set(
      'app',
      storedEntry({ appearance: 'ultraviolet', radius: 'large' })
    );
    expect(readStoredSettings('app')).toEqual({ radius: 'large' });
  });

  it('holds snapshot identity while the stored string is unchanged', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const first = readStoredSettings('app');
    const second = readStoredSettings('app');
    // `useSyncExternalStore` compares with `Object.is`; a fresh object would loop.
    expect(second).toBe(first);
  });

  it('returns a new snapshot once the stored string changes', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const first = readStoredSettings('app');
    entries.set('app', storedEntry({ appearance: 'light' }));
    const second = readStoredSettings('app');
    expect(second).not.toBe(first);
    expect(second).toEqual({ appearance: 'light' });
  });

  it('holds identity across empty results too', () => {
    expect(readStoredSettings('app')).toBe(readStoredSettings('other'));
  });

  it('returns the seed as the server snapshot', () => {
    expect(readServerSettings()).toEqual({});
  });
});

describe('writeStoredSettings', () => {
  it('writes a versioned object', () => {
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    expect(JSON.parse(entries.get('app') as string)).toEqual({
      v: 1,
      settings: { appearance: 'dark' }
    });
  });

  it('merges rather than replaces', () => {
    entries.set('app', storedEntry({ radius: 'large', accentColor: 'mint' }));
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    expect(readStoredSettings('app')).toEqual({
      radius: 'large',
      accentColor: 'mint',
      appearance: 'dark'
    });
  });

  it('applies only the settings its persist list covers', () => {
    writeStoredSettings('app', ['appearance'], {
      appearance: 'dark',
      radius: 'full'
    });
    expect(readStoredSettings('app')).toEqual({ appearance: 'dark' });
  });

  it('leaves fields owned by a theme with a different persist intact', () => {
    writeStoredSettings('app', ['radius'], { radius: 'full' });
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    expect(readStoredSettings('app')).toEqual({
      radius: 'full',
      appearance: 'dark'
    });
  });

  it('notifies in-document readers, which the storage event does not', () => {
    let notified = 0;
    const unsubscribe = subscribeToThemeStorage(() => {
      notified += 1;
    });
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    unsubscribe();
    expect(notified).toBe(1);
  });

  it('does not notify when nothing actually changed', () => {
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    let notified = 0;
    const unsubscribe = subscribeToThemeStorage(() => {
      notified += 1;
    });
    writeStoredSettings('app', ['appearance'], { appearance: 'dark' });
    unsubscribe();
    expect(notified).toBe(0);
  });

  it('leaves a newer-schema entry untouched and reports failure', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'full' }, 99));
    expect(
      writeStoredSettings('app', ['accentColor'], { accentColor: 'mint' })
    ).toBe(false);
    expect(JSON.parse(entries.get('app') as string)).toEqual({
      v: 99,
      settings: { appearance: 'dark', radius: 'full' }
    });
  });

  it('reports success, so the caller can trust storage', () => {
    expect(
      writeStoredSettings('app', ['appearance'], { appearance: 'dark' })
    ).toBe(true);
  });

  it('reports success when storage already holds the value', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    expect(
      writeStoredSettings('app', ['appearance'], { appearance: 'dark' })
    ).toBe(true);
  });

  it('reports failure when setItem throws, and notifies nobody', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    let notified = 0;
    const unsubscribe = subscribeToThemeStorage(() => {
      notified += 1;
    });
    expect(
      writeStoredSettings('app', ['appearance'], { appearance: 'dark' })
    ).toBe(false);
    unsubscribe();
    expect(notified).toBe(0);
    expect(entries.has('app')).toBe(false);
  });
});

describe('when storage access itself throws', () => {
  beforeEach(() => {
    installThrowingLocalStorage();
  });

  it('reads as nothing stored', () => {
    expect(readStoredSettings('app')).toEqual({});
  });

  it('reports the write as failed', () => {
    expect(
      writeStoredSettings('app', ['appearance'], { appearance: 'dark' })
    ).toBe(false);
  });
});

describe('subscribeToThemeStorage', () => {
  it('listens to the storage event for other tabs', () => {
    let notified = 0;
    const unsubscribe = subscribeToThemeStorage(() => {
      notified += 1;
    });
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
    unsubscribe();
    window.dispatchEvent(new Event('storage'));
    expect(notified).toBe(2);
  });
});
