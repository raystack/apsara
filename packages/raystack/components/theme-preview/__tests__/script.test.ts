import { beforeEach, describe, expect, it } from 'vitest';

import { createThemeScript } from '../script';
import { installLocalStorage, installMatchMedia, storedEntry } from './mocks';

let entries: Map<string, string>;

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
  it('emits nothing when there are no uncontrolled persistable keys', () => {
    expect(
      createThemeScript({ persistKey: 'app', keys: [], elementId: 'x' })
    ).toBeNull();
  });

  it('escapes characters that could close the script tag', () => {
    const source = createThemeScript({
      persistKey: '</script><img onerror=alert(1)>',
      keys: ['appearance'],
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
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-accent-color')).toBe('orange');
    expect(element.getAttribute('data-gray-color')).toBe('mauve');
  });

  it('leaves the server-rendered attribute when the entry is absent', () => {
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
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
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('light');
  });

  it('leaves the server-rendered attribute for an out-of-union value', () => {
    entries.set('app', storedEntry({ appearance: 'ultraviolet' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('light');
  });

  it('falls back to a selector when currentScript is unavailable', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const element = themeElement();
    const source = createThemeScript({
      persistKey: 'app',
      keys: ['appearance'],
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
      elementId: 'rs-theme-abc'
    }) as string;

    run(source, element);

    expect(element.getAttribute('data-theme')).toBe('dark');
    expect(element.getAttribute('data-radius')).toBe('medium');
  });
});
