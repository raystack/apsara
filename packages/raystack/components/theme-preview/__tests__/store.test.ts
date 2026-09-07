import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearThemeStorageCache,
  readServerSettings,
  readStoredSettings,
  subscribeToThemeStorage,
  THEME_STORAGE_EVENT,
  writeStoredSettings
} from '../store';
import { installLocalStorage, storedEntry } from './mocks';

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
    // The previous provider stored `"dark"`, which is valid JSON but not an
    // object, and is therefore detectable rather than silently accepted.
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
    // `useSyncExternalStore` compares with `Object.is` and accepts no equality
    // function, so a freshly parsed object each call would re-render forever.
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
