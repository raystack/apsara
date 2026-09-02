import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useThemePreview } from '../context';
import { clearThemeStorageCache } from '../store';
import { ThemePreview } from '../theme-preview';
import { installLocalStorage, installMatchMedia, storedEntry } from './mocks';

let entries: Map<string, string>;

beforeEach(() => {
  entries = installLocalStorage();
  installMatchMedia(false);
  clearThemeStorageCache();
  document.body.innerHTML = '';
});

/** Runs the inline script the way the browser would, before hydration. */
function runInlineScript(container: HTMLElement): void {
  const script = container.querySelector('script');
  if (!script) return;
  Object.defineProperty(document, 'currentScript', {
    configurable: true,
    get: () => script
  });
  try {
    new Function(script.textContent as string)();
  } finally {
    Object.defineProperty(document, 'currentScript', {
      configurable: true,
      get: () => null
    });
  }
}

describe('server rendering', () => {
  it('renders every setting as an attribute on the first byte', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const html = renderToString(
      <ThemePreview persistKey='app' defaultValue={{ accentColor: 'mint' }}>
        content
      </ThemePreview>
    );

    // The server snapshot returns the seed, so the hydration render matches.
    expect(html).toContain('data-theme="light"');
    expect(html).toContain('data-accent-color="mint"');
    expect(html).toContain('data-radius="medium"');
    expect(html).toContain('data-scaling="1"');
  });

  it('renders the script inside the theme element, as its first child', () => {
    const html = renderToString(
      <ThemePreview persistKey='app'>content</ThemePreview>
    );
    const container = document.createElement('div');
    container.innerHTML = html;
    const theme = container.querySelector('.rs-theme') as HTMLElement;

    expect(theme.firstElementChild?.tagName).toBe('SCRIPT');
  });

  it('emits no script and reads no storage when persistence is off', () => {
    const getItem = vi.spyOn(window.localStorage, 'getItem');
    const html = renderToString(<ThemePreview>content</ThemePreview>);
    expect(html).not.toContain('<script');
    expect(getItem).not.toHaveBeenCalled();
  });

  it('carries the CSP nonce onto the script', () => {
    const html = renderToString(
      <ThemePreview persistKey='app' nonce='abc123'>
        content
      </ThemePreview>
    );
    expect(html).toContain('nonce="abc123"');
  });
});

describe('hydration', () => {
  it('keeps the value the script patched in, with no mismatch', async () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));

    const tree = (
      <ThemePreview persistKey='app'>
        <span>content</span>
      </ThemePreview>
    );

    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);

    // The server wrote `light`; the script corrects the DOM before paint.
    const theme = container.querySelector('.rs-theme') as HTMLElement;
    expect(theme.getAttribute('data-theme')).toBe('light');
    runInlineScript(theme);
    expect(theme.getAttribute('data-theme')).toBe('dark');

    const error = vi.spyOn(console, 'error').mockImplementation(() => {
      /* swallow React's expected error logging */
    });
    await act(async () => {
      hydrateRoot(container, tree);
    });

    // The post-hydration snapshot returns the same value, so nothing moves.
    expect(theme.getAttribute('data-theme')).toBe('dark');
    const hydrationWarnings = error.mock.calls.filter(call =>
      String(call[0]).includes('did not match')
    );
    expect(hydrationWarnings).toHaveLength(0);
    error.mockRestore();
  });

  it('reconciles the element when no script ran to correct it', async () => {
    // `system` with no persistence: the server guesses light, nothing patches
    // the DOM, and React does not fix attribute mismatches during hydration.
    installMatchMedia(true);

    const tree = (
      <ThemePreview defaultValue={{ appearance: 'system' }}>
        <span>content</span>
      </ThemePreview>
    );

    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);
    const theme = container.querySelector('.rs-theme') as HTMLElement;
    expect(theme.getAttribute('data-theme')).toBe('light');

    const error = vi.spyOn(console, 'error').mockImplementation(() => {
      /* swallow React's expected error logging */
    });
    await act(async () => {
      hydrateRoot(container, tree);
    });
    error.mockRestore();

    expect(theme.getAttribute('data-theme')).toBe('dark');
  });

  it('gives the hook the stored value after hydration', async () => {
    entries.set('app', storedEntry({ radius: 'full' }));
    let seen: string | undefined;
    function Probe() {
      seen = useThemePreview().resolved.radius;
      return null;
    }

    const tree = (
      <ThemePreview persistKey='app'>
        <Probe />
      </ThemePreview>
    );

    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);
    expect(seen).toBe('medium');

    await act(async () => {
      hydrateRoot(container, tree);
    });

    expect(seen).toBe('full');
  });
});
