import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from '../context';
import { clearThemeStorageCache } from '../store';
import { Theme } from '../theme';
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
      <Theme persistKey='app' defaultValue={{ accentColor: 'mint' }}>
        content
      </Theme>
    );

    expect(html).toContain('data-theme="light"');
    expect(html).toContain('data-accent-color="mint"');
    expect(html).toContain('data-radius="medium"');
    expect(html).toContain('data-scaling="1"');
  });

  it('renders the script inside the theme element, as its first child', () => {
    const html = renderToString(<Theme persistKey='app'>content</Theme>);
    const container = document.createElement('div');
    container.innerHTML = html;
    const theme = container.querySelector('.rs-theme') as HTMLElement;

    expect(theme.firstElementChild?.tagName).toBe('SCRIPT');
  });

  it('emits no script and reads no storage for a pinned appearance without persistence', () => {
    const getItem = vi.spyOn(window.localStorage, 'getItem');
    const html = renderToString(
      <Theme defaultValue={{ appearance: 'light' }}>content</Theme>
    );
    expect(html).not.toContain('<script');
    expect(getItem).not.toHaveBeenCalled();
  });

  it('resolves a seeded `system` appearance before hydration on a first visit', () => {
    // Nothing stored and the OS is dark: the server's light must not survive.
    installMatchMedia(true);
    const html = renderToString(<Theme persistKey='app'>content</Theme>);
    const container = document.createElement('div');
    container.innerHTML = html;
    const theme = container.querySelector('.rs-theme') as HTMLElement;
    expect(theme.getAttribute('data-theme')).toBe('light');

    runInlineScript(theme);

    expect(theme.getAttribute('data-theme')).toBe('dark');
  });

  it('carries the CSP nonce onto the script', () => {
    const html = renderToString(
      <Theme persistKey='app' nonce='abc123'>
        content
      </Theme>
    );
    expect(html).toContain('nonce="abc123"');
  });
});

describe('hydration', () => {
  it('keeps the value the script patched in, with no mismatch', async () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));

    const tree = (
      <Theme persistKey='app'>
        <span>content</span>
      </Theme>
    );

    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);

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

    expect(theme.getAttribute('data-theme')).toBe('dark');
    const hydrationWarnings = error.mock.calls.filter(call =>
      String(call[0]).includes('did not match')
    );
    expect(hydrationWarnings).toHaveLength(0);
    error.mockRestore();
  });

  it('reconciles the element when no script ran to correct it', async () => {
    // React does not fix attribute mismatches during hydration; the mount effect does.
    installMatchMedia(true);

    const tree = (
      <Theme defaultValue={{ appearance: 'system' }}>
        <span>content</span>
      </Theme>
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
      seen = useTheme().resolved.radius;
      return null;
    }

    const tree = (
      <Theme persistKey='app'>
        <Probe />
      </Theme>
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
