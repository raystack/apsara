import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, type SVGProps, useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { XIcon } from '~/icons';
import { radiusClass } from '../../../shared/radius';
import { Dialog } from '../../dialog';
import { useTheme } from '../context';
import { useThemeInjection } from '../portal';
import type { ThemeSettings } from '../settings';
import { clearThemeStorageCache } from '../store';
import { Theme } from '../theme';
import {
  installLocalStorage,
  installMatchMedia,
  installThrowingLocalStorage,
  type MediaController,
  storedEntry
} from './mocks';

let entries: Map<string, string>;
let media: MediaController;

beforeEach(() => {
  entries = installLocalStorage();
  media = installMatchMedia(false);
  clearThemeStorageCache();
});

function themeElement(container: HTMLElement, index = 0): HTMLElement {
  const elements = container.querySelectorAll<HTMLElement>('.rs-theme');
  const element = elements[index];
  if (!element) throw new Error(`No theme element at index ${index}`);
  return element;
}

function Probe({ label = 'probe' }: { label?: string }) {
  const theme = useTheme();
  return (
    <output data-testid={label}>
      {JSON.stringify({ value: theme.value, resolved: theme.resolved })}
    </output>
  );
}

function readProbe(label = 'probe'): {
  value: ThemeSettings;
  resolved: ThemeSettings;
} {
  return JSON.parse(screen.getByTestId(label).textContent as string);
}

// ─── Attributes ─────────────────────────────────────────────────────────────

describe('Theme attributes', () => {
  it('writes every setting as a data attribute on its own element', () => {
    const { container } = render(<Theme>content</Theme>);
    const element = themeElement(container);

    expect(element).toHaveAttribute('data-theme', 'light');
    expect(element).toHaveAttribute('data-accent-color', 'indigo');
    expect(element).toHaveAttribute('data-gray-color', 'slate');
    expect(element).toHaveAttribute('data-radius', 'medium');
    expect(element).toHaveAttribute('data-scaling', '1');
    expect(element).toHaveAttribute('data-panel-background', 'solid');
    expect(element).toHaveAttribute('data-reduced-motion', 'system');
  });

  it('writes nothing to the document element', () => {
    render(<Theme>content</Theme>);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.documentElement.hasAttribute('data-accent-color')).toBe(
      false
    );
  });

  it('carries the stable rs-theme override class', () => {
    const { container } = render(<Theme className='mine'>content</Theme>);
    const element = themeElement(container);
    expect(element).toHaveClass('rs-theme');
    expect(element).toHaveClass('mine');
  });

  it('lets a nested scope layer settings over its parent', () => {
    const { container } = render(
      <Theme defaultValue={{ accentColor: 'orange', radius: 'large' }}>
        <Theme defaultValue={{ accentColor: 'mint' }}>scoped</Theme>
      </Theme>
    );

    const scope = themeElement(container, 1);
    expect(scope).toHaveAttribute('data-accent-color', 'mint');
    expect(scope).toHaveAttribute('data-radius', 'large');
  });
});

// ─── Root marker and background ─────────────────────────────────────────────

describe('the root marker', () => {
  it('marks a theme with no ancestor', () => {
    const { container } = render(<Theme>content</Theme>);
    expect(themeElement(container)).toHaveAttribute('data-rs-root');
  });

  it('does not mark a nested theme', () => {
    const { container } = render(
      <Theme>
        <Theme>scoped</Theme>
      </Theme>
    );
    expect(themeElement(container, 1)).not.toHaveAttribute('data-rs-root');
  });

  it('isRoot={false} suppresses the marker but leaves the theme intact', () => {
    const { container } = render(
      <Theme isRoot={false} defaultValue={{ appearance: 'dark' }}>
        widget
      </Theme>
    );
    const element = themeElement(container);
    expect(element).not.toHaveAttribute('data-rs-root');
    expect(element).toHaveAttribute('data-theme', 'dark');
    expect(element).toHaveAttribute('data-accent-color', 'indigo');
  });
});

describe('hasBackground', () => {
  it('paints at the root by default', () => {
    const { container } = render(<Theme>content</Theme>);
    expect(themeElement(container)).toHaveAttribute('data-rs-background');
  });

  it('paints a nested theme that sets an explicit appearance', () => {
    const { container } = render(
      <Theme>
        <Theme defaultValue={{ appearance: 'dark' }}>panel</Theme>
      </Theme>
    );
    expect(themeElement(container, 1)).toHaveAttribute('data-rs-background');
  });

  it('does not paint a nested theme that only re-tints', () => {
    const { container } = render(
      <Theme>
        <Theme defaultValue={{ accentColor: 'mint' }}>tint</Theme>
      </Theme>
    );
    expect(themeElement(container, 1)).not.toHaveAttribute(
      'data-rs-background'
    );
  });

  it('paints a nested theme whose appearance comes from storage', () => {
    entries.set('panel', storedEntry({ appearance: 'dark' }));
    const { container } = render(
      <Theme>
        <Theme persistKey='panel' persist={['appearance']}>
          panel
        </Theme>
      </Theme>
    );
    const panel = themeElement(container, 1);
    expect(panel).toHaveAttribute('data-theme', 'dark');
    expect(panel).toHaveAttribute('data-rs-background');
  });

  it('starts painting once a nested theme gets an appearance at runtime', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }
    const { container } = render(
      <Theme>
        <Theme>
          <Switcher />
        </Theme>
      </Theme>
    );
    const panel = themeElement(container, 1);
    expect(panel).not.toHaveAttribute('data-rs-background');

    await user.click(screen.getByRole('button'));

    expect(panel).toHaveAttribute('data-theme', 'dark');
    expect(panel).toHaveAttribute('data-rs-background');
  });

  it('honours an explicit override', () => {
    const { container } = render(<Theme hasBackground={false}>content</Theme>);
    expect(themeElement(container)).not.toHaveAttribute('data-rs-background');
  });
});

// ─── Controlled and uncontrolled ────────────────────────────────────────────

describe('controlled versus uncontrolled precedence', () => {
  it('a controlled key ignores a stored value', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const { container } = render(
      <Theme persistKey='app' value={{ appearance: 'light' }}>
        content
      </Theme>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
  });

  it('a stored value overrides the seed for an uncontrolled key', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const { container } = render(
      <Theme persistKey='app' defaultValue={{ appearance: 'light' }}>
        content
      </Theme>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('control is per key', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'full' }));
    const { container } = render(
      <Theme persistKey='app' value={{ appearance: 'light' }}>
        content
      </Theme>
    );
    const element = themeElement(container);
    expect(element).toHaveAttribute('data-theme', 'light');
    expect(element).toHaveAttribute('data-radius', 'full');
  });

  it('setValue never writes a controlled key', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button
          type='button'
          onClick={() => setValue({ appearance: 'dark', radius: 'large' })}
        >
          set
        </button>
      );
    }

    const { container } = render(
      <Theme persistKey='app' value={{ appearance: 'light' }}>
        <Switcher />
      </Theme>
    );
    await user.click(screen.getByRole('button'));

    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
    expect(themeElement(container)).toHaveAttribute('data-radius', 'large');
    expect(JSON.parse(entries.get('app') as string).settings).toEqual({
      radius: 'large'
    });
  });
});

// ─── Persistence ────────────────────────────────────────────────────────────

describe('persistence', () => {
  it('does not touch storage without a persistKey', async () => {
    const getItem = vi.spyOn(window.localStorage, 'getItem');
    const setItem = vi.spyOn(window.localStorage, 'setItem');
    const user = userEvent.setup();

    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <Theme>
        <Switcher />
      </Theme>
    );
    await user.click(screen.getByRole('button'));

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });

  it('emits no inline script when nothing needs patching', () => {
    const { container } = render(
      <Theme defaultValue={{ appearance: 'light' }}>content</Theme>
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('emits a storage-free script for a `system` appearance without a persistKey', () => {
    const { container } = render(<Theme>content</Theme>);
    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.textContent).not.toContain('localStorage');
    expect(script?.textContent).toContain('matchMedia');
  });

  it('emits an inline script for a persisted namespace', () => {
    const { container } = render(<Theme persistKey='app'>content</Theme>);
    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    // First child, so it patches the opening tag already parsed above it.
    expect(themeElement(container).firstChild).toBe(script);
  });

  it('omits the script when every persistable setting is controlled', () => {
    const { container } = render(
      <Theme
        persistKey='app'
        persist={['appearance']}
        value={{ appearance: 'dark' }}
      >
        content
      </Theme>
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('omits the script when persist excludes everything and appearance is pinned', () => {
    const { container } = render(
      <Theme
        persistKey='app'
        persist={[]}
        defaultValue={{ appearance: 'light' }}
      >
        content
      </Theme>
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('reads no storage when persist excludes everything but appearance is system', () => {
    const { container } = render(
      <Theme persistKey='app' persist={[]}>
        content
      </Theme>
    );
    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.textContent).not.toContain('localStorage');
  });

  it('narrows a namespace with persist, keeping other settings in memory', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button
          type='button'
          onClick={() => setValue({ appearance: 'dark', radius: 'large' })}
        >
          set
        </button>
      );
    }

    const { container } = render(
      <Theme persistKey='app' persist={['appearance']}>
        <Switcher />
      </Theme>
    );
    await user.click(screen.getByRole('button'));

    const element = themeElement(container);
    expect(element).toHaveAttribute('data-theme', 'dark');
    expect(element).toHaveAttribute('data-radius', 'large');
    expect(JSON.parse(entries.get('app') as string).settings).toEqual({
      appearance: 'dark'
    });
  });

  it('keeps two themes sharing a namespace in step within one document', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <>
        <Theme persistKey='shared'>
          <Switcher />
        </Theme>
        <Theme persistKey='shared' isRoot={false}>
          second
        </Theme>
      </>
    );

    await user.click(screen.getByRole('button'));

    // `storage` never fires in the writing document; the in-document event does.
    expect(themeElement(container, 0)).toHaveAttribute('data-theme', 'dark');
    expect(themeElement(container, 1)).toHaveAttribute('data-theme', 'dark');
  });

  it('synchronises across tabs through the storage event', () => {
    const { container } = render(<Theme persistKey='app'>content</Theme>);
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');

    act(() => {
      entries.set('app', storedEntry({ appearance: 'dark' }));
      window.dispatchEvent(new Event('storage'));
    });

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('reads storage on the first render under CSR', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'full' }));
    const renders: string[] = [];
    function Recorder() {
      const { resolved } = useTheme();
      renders.push(`${resolved.appearance}/${resolved.radius}`);
      return null;
    }

    render(
      <Theme persistKey='app'>
        <Recorder />
      </Theme>
    );

    expect(renders[0]).toBe('dark/full');
  });

  it('falls back to the seed for an unparseable entry', () => {
    entries.set('app', 'not json at all');
    const { container } = render(
      <Theme persistKey='app' defaultValue={{ appearance: 'dark' }}>
        content
      </Theme>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });
});

// ─── Resolution ─────────────────────────────────────────────────────────────

describe('resolution', () => {
  it('resolves `system` against the OS', () => {
    installMatchMedia(true);
    const { container } = render(
      <Theme defaultValue={{ appearance: 'system' }}>
        <Probe />
      </Theme>
    );

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
    const probe = readProbe();
    expect(probe.value.appearance).toBe('system');
    expect(probe.resolved.appearance).toBe('dark');
  });

  it('follows the OS when it changes', () => {
    const { container } = render(<Theme>content</Theme>);
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');

    media.setPrefersDark(true);

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('pairs `auto` gray to the accent', () => {
    const { container } = render(
      <Theme defaultValue={{ accentColor: 'orange' }}>
        <Probe />
      </Theme>
    );

    expect(themeElement(container)).toHaveAttribute('data-gray-color', 'mauve');
    expect(readProbe().value.grayColor).toBe('auto');
    expect(readProbe().resolved.grayColor).toBe('mauve');
  });

  it('honours an explicit gray over the pairing', () => {
    const { container } = render(
      <Theme defaultValue={{ accentColor: 'orange', grayColor: 'sage' }}>
        content
      </Theme>
    );
    expect(themeElement(container)).toHaveAttribute('data-gray-color', 'sage');
  });

  it('reports the OS appearance whatever the setting is', () => {
    installMatchMedia(true);
    function SystemProbe() {
      const { systemAppearance, resolved } = useTheme();
      return (
        <output data-testid='sys'>{`${systemAppearance}/${resolved.appearance}`}</output>
      );
    }
    render(
      <Theme defaultValue={{ appearance: 'light' }}>
        <SystemProbe />
      </Theme>
    );
    expect(screen.getByTestId('sys')).toHaveTextContent('dark/light');
  });
});

// ─── The hook ───────────────────────────────────────────────────────────────

describe('useTheme', () => {
  it('throws outside a provider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {
      /* swallow React's expected error logging */
    });
    expect(() => render(<Probe />)).toThrow(/must be called inside/);
    error.mockRestore();
  });

  it('reaches the root provider from inside a scope', async () => {
    const user = userEvent.setup();
    function RootSwitcher() {
      const { root } = useTheme();
      return (
        <button
          type='button'
          onClick={() => root.setValue({ appearance: 'dark' })}
        >
          flip root
        </button>
      );
    }

    const { container } = render(
      <Theme>
        <Theme defaultValue={{ accentColor: 'mint' }}>
          <RootSwitcher />
        </Theme>
      </Theme>
    );

    await user.click(screen.getByRole('button'));

    expect(themeElement(container, 0)).toHaveAttribute('data-theme', 'dark');
    expect(themeElement(container, 1)).toHaveAttribute('data-theme', 'dark');
  });

  it('reports the nearest theme as the root when there is only one', () => {
    function RootProbe() {
      const theme = useTheme();
      return (
        <output data-testid='root'>{theme.root.resolved.accentColor}</output>
      );
    }
    render(
      <Theme defaultValue={{ accentColor: 'mint' }}>
        <RootProbe />
      </Theme>
    );
    expect(screen.getByTestId('root')).toHaveTextContent('mint');
  });
});

// ─── onValueChange ──────────────────────────────────────────────────────────

describe('onValueChange', () => {
  it('fires with the full next settings and the changed subset', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    render(
      <Theme onValueChange={onValueChange}>
        <Switcher />
      </Theme>
    );

    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [next, changed] = onValueChange.mock.calls[0];
    expect(next.appearance).toBe('dark');
    expect(next.accentColor).toBe('indigo');
    expect(changed).toEqual({ appearance: 'dark' });
  });

  it('reports a controlled key without applying it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'light' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <Theme value={{ appearance: 'dark' }} onValueChange={onValueChange}>
        <Switcher />
      </Theme>
    );
    await user.click(screen.getByRole('button'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [next, changed] = onValueChange.mock.calls[0];
    expect(next.appearance).toBe('light');
    expect(changed).toEqual({ appearance: 'light' });
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('does not fire for a value that is already set', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'light' })}>
          set
        </button>
      );
    }

    render(
      <Theme
        defaultValue={{ appearance: 'light' }}
        onValueChange={onValueChange}
      >
        <Switcher />
      </Theme>
    );
    await user.click(screen.getByRole('button'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not fire for a change that arrives from storage', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Theme persistKey='app' onValueChange={onValueChange}>
        content
      </Theme>
    );

    act(() => {
      entries.set('app', storedEntry({ accentColor: 'mint' }));
      window.dispatchEvent(new Event('storage'));
    });

    expect(themeElement(container)).toHaveAttribute(
      'data-accent-color',
      'mint'
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

// ─── Storage unavailable ────────────────────────────────────────────────────

describe('when storage is unavailable', () => {
  it('still applies a persisted setting, in memory', async () => {
    installThrowingLocalStorage();
    const user = userEvent.setup();

    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <Theme persistKey='app'>
        <Switcher />
      </Theme>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');

    await user.click(screen.getByRole('button'));

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });
});

// ─── The render prop ────────────────────────────────────────────────────────

describe('render', () => {
  it('merges the theme onto a caller-supplied element', () => {
    const { container } = render(
      <Theme render={<section className='page' />}>content</Theme>
    );
    const element = themeElement(container);
    expect(element.tagName).toBe('SECTION');
    expect(element).toHaveClass('page');
    expect(element).toHaveAttribute('data-theme', 'light');
    expect(container.querySelectorAll('.rs-theme')).toHaveLength(1);
  });

  it('accepts a function form', () => {
    const { container } = render(
      <Theme render={props => <main {...props} />}>content</Theme>
    );
    expect(themeElement(container).tagName).toBe('MAIN');
  });

  it('keeps the theme children, including the inline script', () => {
    const { container } = render(
      <Theme
        persistKey='app'
        render={<section>supplied children are replaced</section>}
      >
        <span data-testid='mine'>mine</span>
      </Theme>
    );
    const element = themeElement(container);
    expect(element.firstElementChild?.tagName).toBe('SCRIPT');
    expect(screen.getByTestId('mine')).toBeInTheDocument();
    expect(element).not.toHaveTextContent('supplied children are replaced');
  });

  it('fires both refs', () => {
    let ours: HTMLElement | null = null;
    let theirs: unknown = null;
    render(
      <Theme
        ref={node => {
          ours = node;
        }}
        render={
          <section
            ref={node => {
              theirs = node;
            }}
          />
        }
      >
        content
      </Theme>
    );
    expect(ours).not.toBeNull();
    expect(theirs).toBe(ours);
  });
});

// ─── Portals ────────────────────────────────────────────────────────────────

describe('the portal re-injector', () => {
  function Portalled({ children }: { children?: ReactNode }) {
    const theme = useThemeInjection();
    return (
      <div {...theme} data-testid='portalled'>
        {children}
      </div>
    );
  }

  it('re-emits the inherited settings onto the portalled element', () => {
    render(
      <Theme defaultValue={{ appearance: 'dark', accentColor: 'mint' }}>
        <Theme defaultValue={{ accentColor: 'orange' }}>
          <Portalled />
        </Theme>
      </Theme>
    );

    const portalled = screen.getByTestId('portalled');
    expect(portalled).toHaveClass('rs-theme');
    expect(portalled).toHaveAttribute('data-theme', 'dark');
    expect(portalled).toHaveAttribute('data-accent-color', 'orange');
  });

  it('emits nothing outside a provider', () => {
    render(<Portalled />);
    const portalled = screen.getByTestId('portalled');
    expect(portalled).not.toHaveClass('rs-theme');
    expect(portalled).not.toHaveAttribute('data-theme');
  });

  /* The backdrop is a sibling of the popup, not a descendant, so a theme on the
     popup alone never reaches it and `--rs-color-overlay` resolves to nothing —
     an invisible scrim. The portal node is the only ancestor they share. */
  it('themes the parts that sit beside the popup, not just the popup', async () => {
    const user = userEvent.setup();
    render(
      <Theme defaultValue={{ appearance: 'dark' }}>
        <Dialog>
          <Dialog.Trigger render={<button type='button'>open</button>} />
          <Dialog.Content>
            <Dialog.Title>Titled</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      </Theme>
    );
    await user.click(screen.getByRole('button', { name: 'open' }));

    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(backdrop).not.toBeNull();
    expect(backdrop?.closest('[data-theme]')).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  /* Both portals land under <body> as siblings, so the inner dialog gets its
     theme from the React tree it was declared in, not from where it renders. */
  it('keeps a nested dialog on its own scope, not the dialog that opened it', async () => {
    const user = userEvent.setup();
    render(
      <Theme defaultValue={{ appearance: 'dark', accentColor: 'mint' }}>
        <Dialog>
          <Dialog.Trigger render={<button type='button'>outer</button>} />
          <Dialog.Content>
            <Dialog.Title>Outer</Dialog.Title>
            <Theme
              defaultValue={{ appearance: 'light', accentColor: 'orange' }}
            >
              <Dialog>
                <Dialog.Trigger render={<button type='button'>inner</button>} />
                <Dialog.Content>
                  <Dialog.Title>Inner</Dialog.Title>
                </Dialog.Content>
              </Dialog>
            </Theme>
          </Dialog.Content>
        </Dialog>
      </Theme>
    );

    await user.click(screen.getByRole('button', { name: 'outer' }));
    await user.click(screen.getByRole('button', { name: 'inner' }));

    const scopeOf = (element: Element) => {
      const scope = element.closest('[data-theme]');
      return [
        scope?.getAttribute('data-theme'),
        scope?.getAttribute('data-accent-color')
      ];
    };

    // Base UI renders no backdrop for a nested dialog; the parent's serves both.
    const backdrops = [
      ...document.querySelectorAll('[data-slot="dialog-backdrop"]')
    ];
    expect(backdrops).toHaveLength(1);
    expect(scopeOf(backdrops[0])).toEqual(['dark', 'mint']);

    const titles = [...document.querySelectorAll('[data-slot="dialog-title"]')];
    expect(titles.map(t => [t.textContent, ...scopeOf(t)])).toEqual([
      ['Outer', 'dark', 'mint'],
      ['Inner', 'light', 'orange']
    ]);
  });

  it('gives each open portal its own scope', async () => {
    const user = userEvent.setup();
    render(
      <Theme defaultValue={{ appearance: 'dark' }}>
        <Theme defaultValue={{ appearance: 'light' }}>
          <Dialog>
            <Dialog.Trigger render={<button type='button'>open</button>} />
            <Dialog.Content>
              <Dialog.Title>Titled</Dialog.Title>
            </Dialog.Content>
          </Dialog>
        </Theme>
      </Theme>
    );
    await user.click(screen.getByRole('button', { name: 'open' }));

    // The trigger's scope wins over the page it is portalled past.
    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(backdrop?.closest('[data-theme]')).toHaveAttribute(
      'data-theme',
      'light'
    );
  });
});

// ─── Per-component radius ───────────────────────────────────────────────────

describe('the shared radius override', () => {
  it('maps each level to its own class', () => {
    expect(radiusClass('none')).toBeTruthy();
    expect(radiusClass('full')).toBeTruthy();
    expect(radiusClass('small')).not.toBe(radiusClass('large'));
  });

  it('returns nothing when the prop is unset', () => {
    expect(radiusClass(undefined)).toBeUndefined();
    expect(radiusClass(null)).toBeUndefined();
  });
});

// ─── Transitions ────────────────────────────────────────────────────────────

describe('disableTransitionOnChange', () => {
  it('suppresses transitions across an appearance switch', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    render(
      <Theme disableTransitionOnChange>
        <Switcher />
      </Theme>
    );

    const before = document.head.querySelectorAll('style').length;
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    // The guard style is removed on the next tick, so assert cleanup, not presence.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
    });
    expect(document.head.querySelectorAll('style').length).toBe(before);
  });

  it('does not suppress anything on the first render', () => {
    const before = document.head.querySelectorAll('style').length;
    render(<Theme disableTransitionOnChange>content</Theme>);
    expect(document.head.querySelectorAll('style').length).toBe(before);
  });
});

describe('appearance transition', () => {
  // The attribute lives on the document, not on the theme element.
  const marker = 'data-rs-appearance-change';
  beforeEach(() => {
    document.documentElement.removeAttribute(marker);
  });

  function Switcher({ to }: { to: 'light' | 'dark' }) {
    const { setValue } = useTheme();
    return (
      <button type='button' onClick={() => setValue({ appearance: to })}>
        set
      </button>
    );
  }

  function stubViewTransition() {
    let resolveFinished: () => void = () => undefined;
    const finished = new Promise<void>(resolve => {
      resolveFinished = resolve;
    });
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return { finished };
    });
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      writable: true,
      value: startViewTransition
    });
    return {
      startViewTransition,
      finish: async () => {
        resolveFinished();
        await act(async () => {
          await finished;
          await Promise.resolve();
        });
      },
      restore: () => {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
    };
  }

  it('crossfades an appearance switch and marks the document while it runs', async () => {
    const user = userEvent.setup();
    const vt = stubViewTransition();

    render(
      <Theme>
        <Switcher to='dark' />
      </Theme>
    );
    expect(document.documentElement).not.toHaveAttribute(marker);

    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(vt.startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.documentElement).toHaveAttribute(marker);

    await vt.finish();
    expect(document.documentElement).not.toHaveAttribute(marker);
    vt.restore();
  });

  it('applies the change even where view transitions are unsupported', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Theme>
        <Switcher to='dark' />
      </Theme>
    );

    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).not.toHaveAttribute(marker);
  });

  it('leaves a setting other than appearance alone', async () => {
    const user = userEvent.setup();
    const vt = stubViewTransition();

    function RadiusSwitcher() {
      const { setValue } = useTheme();
      return (
        <button type='button' onClick={() => setValue({ radius: 'full' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <Theme>
        <RadiusSwitcher />
      </Theme>
    );
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(vt.startViewTransition).not.toHaveBeenCalled();
    expect(themeElement(container)).toHaveAttribute('data-radius', 'full');
    vt.restore();
  });

  it('skips the crossfade when transitions are disabled', async () => {
    const user = userEvent.setup();
    const vt = stubViewTransition();

    render(
      <Theme disableTransitionOnChange>
        <Switcher to='dark' />
      </Theme>
    );
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(vt.startViewTransition).not.toHaveBeenCalled();
    expect(document.documentElement).not.toHaveAttribute(marker);
    vt.restore();
  });

  it('skips the crossfade under reduced motion', async () => {
    const user = userEvent.setup();
    const vt = stubViewTransition();

    render(
      <Theme defaultValue={{ reducedMotion: 'true' }}>
        <Switcher to='dark' />
      </Theme>
    );
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(vt.startViewTransition).not.toHaveBeenCalled();
    vt.restore();
  });

  it('skips the crossfade for a scope, which repaints no more than itself', async () => {
    const user = userEvent.setup();
    const vt = stubViewTransition();

    const { container } = render(
      <Theme>
        <Theme isRoot={false}>
          <Switcher to='dark' />
        </Theme>
      </Theme>
    );
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(vt.startViewTransition).not.toHaveBeenCalled();
    expect(document.documentElement).not.toHaveAttribute(marker);
    expect(themeElement(container, 1)).toHaveAttribute('data-theme', 'dark');
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
    vt.restore();
  });
});

// ─── Mount reconciliation ───────────────────────────────────────────────────

describe('mount reconciliation', () => {
  it('leaves the element alone when nothing drifted', () => {
    const observed: string[] = [];
    function Watcher() {
      useEffect(() => {
        observed.push('mounted');
      }, []);
      return null;
    }
    const { container } = render(
      <Theme>
        <Watcher />
      </Theme>
    );
    expect(observed).toEqual(['mounted']);
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
  });
});

// ─── Icons ──────────────────────────────────────────────────────────────────

// The registry itself is tested in `icons/__tests__/registry.test.tsx`. These
// cover the wiring: that `<Theme>` mounts the IconProvider, and only when the
// consumer configures it.
describe('icons', () => {
  const StubIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} data-testid='stub' />
  );

  it('resolves the overrides given to Theme', () => {
    render(
      <Theme icons={{ components: { XIcon: StubIcon } }}>
        <XIcon />
      </Theme>
    );

    expect(screen.getByTestId('stub')).toHaveAttribute('data-icon', 'XIcon');
  });

  it('resolves the icon props given to Theme', () => {
    render(
      <Theme icons={{ props: { strokeWidth: 1.5 } }}>
        <XIcon />
      </Theme>
    );

    expect(document.querySelector('[data-icon="XIcon"]')).toHaveAttribute(
      'stroke-width',
      '1.5'
    );
  });

  it('renders the defaults when Theme configures no icons', () => {
    render(
      <Theme>
        <XIcon />
      </Theme>
    );

    const icon = document.querySelector('[data-icon="XIcon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('stroke-width', '1.5');
  });

  it('layers a nested Theme per icon key', () => {
    render(
      <Theme icons={{ components: { XIcon: StubIcon } }}>
        <Theme icons={{ props: { strokeWidth: 1 } }}>
          <XIcon />
        </Theme>
      </Theme>
    );

    // The inner Theme sets props only, so XIcon keeps the outer override and
    // gains the inner stroke weight.
    expect(screen.getByTestId('stub')).toHaveAttribute('stroke-width', '1');
  });

  it('lets a nested Theme replace an icon the outer one named', () => {
    const Inner = (props: SVGProps<SVGSVGElement>) => (
      <svg {...props} data-testid='inner' />
    );

    render(
      <Theme icons={{ components: { XIcon: StubIcon } }}>
        <Theme icons={{ components: { XIcon: Inner } }}>
          <XIcon />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('inner')).toBeInTheDocument();
    expect(screen.queryByTestId('stub')).not.toBeInTheDocument();
  });
});
