import { beforeEach, describe, expect, it } from 'vitest';

import { createThemeScript } from '../script';
import { THEME_DEFAULT_SETTINGS, type ThemeSettings } from '../settings';
import { installLocalStorage, installMatchMedia, storedEntry } from './mocks';

let entries: Map<string, string>;

/** What a server rendered from when appearance is pinned: nothing to resolve. */
const LIGHT_SEED: ThemeSettings = {
  ...THEME_DEFAULT_SETTINGS,
  appearance: 'light'
};
/** The default seed, whose `system` appearance only the browser can resolve. */
const SYSTEM_SEED: ThemeSettings = THEME_DEFAULT_SETTINGS;

beforeEach(() => {
  entries = installLocalStorage();
  installMatchMedia(false);
  document.body.innerHTML = '';
});

/** Runs a generated script the way the browser would: as its own child. */
function run(source: string, parent: HTMLElement): void {
  const script = document.createElement('script');
  parent.appendChild(script);
  Object.defineProperty(document, 'currentScript', {
    configurable: true,
    get: () => script
  });
  try {
    new Function(source)();
  } finally {
    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      get: () => null
    });
  }
}

function themeElement(attributes: Record<string, string> = {}): HTMLDivElement {
  const element = document.createElement('div');
  element.className = 'rs-theme';
  element.setAttribute('data-theme', 'light');
  element.setAttribute('data-accent-color', 'indigo');
  element.setAttribute('data-gray-color', 'slate');
  element.setAttribute('data-rs-theme-id', 'rs-theme-abc');
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  document.body.appendChild(element);
  return element;
}

describe('createThemeScript', () => {
  it('emits nothing when no key is stored and nothing needs the browser', () => {
    expect(
      createThemeScript({ keys: [], seed: LIGHT_SEED, elementId: 'x' })
    ).toBeNull();
    expect(
      createThemeScript({
        persistKey: 'app',
        keys: [],
        seed: LIGHT_SEED,
        elementId: 'x'
      })
    ).toBeNull();
  });

  it('emits a storage-free script for a seeded `system` appearance', () => {
    const source = createThemeScript({
      keys: [],
      seed: SYSTEM_SEED,
      elementId: 'x'
    });
    expect(source).not.toBeNull();
    expect(source).not.toContain('localStorage');
    expect(source).toContain('matchMedia');
  });

  it('escapes characters that could close the script tag', () => {
    const source = createThemeScript({
      persistKey: '</script><img onerror=alert(1)>',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'x'
    });
    expect(source).not.toContain('</script>');
    expect(source).toContain('\\u003c');
  });
});

describe('the generated script', () => {
  it('patches its own parent from the stored value', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves a stored `system` appearance against the OS', () => {
    installMatchMedia(true);
    entries.set('app', storedEntry({ appearance: 'system' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves a seeded `system` appearance against the OS when nothing is stored', () => {
    // The common first visit: OS dark, storage empty, server rendered light.
    installMatchMedia(true);
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: SYSTEM_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves a seeded `system` appearance without a persistKey', () => {
    installMatchMedia(true);
    const element = themeElement();
    const source = createThemeScript({
      keys: [],
      seed: SYSTEM_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves a stored `auto` gray against the accent it just wrote', () => {
    entries.set(
      'app',
      storedEntry({ accentColor: 'orange', grayColor: 'auto' })
    );
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['accentColor', 'grayColor'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-accent-color')).toBe('orange');
    expect(element.getAttribute('data-gray-color')).toBe('mauve');
  });

  it('resolves a seeded `auto` gray against a stored accent', () => {
    // Gray is not persisted here, but its seed follows the accent, which is.
    entries.set('app', storedEntry({ accentColor: 'orange' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['accentColor'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-accent-color')).toBe('orange');
    expect(element.getAttribute('data-gray-color')).toBe('mauve');
  });

  it('leaves a pinned appearance alone when the entry is absent', () => {
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('light');
  });

  it('leaves the server-rendered attribute when the entry is malformed', () => {
    entries.set('app', '{ broken');
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('light');
  });

  it('falls back to the seed for an out-of-union stored value', () => {
    // The React reader drops the bad field and lands on the seed too.
    installMatchMedia(true);
    entries.set('app', storedEntry({ appearance: 'ultraviolet' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: SYSTEM_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to a selector when currentScript is unavailable', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      get: () => null
    });
    new Function(source)();

    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('never writes a key it was not given, even when one is stored', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'full' }));
    const element = themeElement({ 'data-radius': 'medium' });
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      seed: LIGHT_SEED,
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
    expect(element.getAttribute('data-radius')).toBe('medium');
  });
});
