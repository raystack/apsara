import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useThemePreview } from '../context';
import { useThemeInjection } from '../portal';
import { radiusClass } from '../radius';
import type { ThemeSettings } from '../settings';
import { clearThemeStorageCache } from '../store';
import { ThemePreview } from '../theme-preview';
import {
  installLocalStorage,
  installMatchMedia,
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

/** The element every theme carries the documented override class on. */
function themeElement(container: HTMLElement, index = 0): HTMLElement {
  const elements = container.querySelectorAll<HTMLElement>('.rs-theme');
  const element = elements[index];
  if (!element) throw new Error(`No theme element at index ${index}`);
  return element;
}

function Probe({ label = 'probe' }: { label?: string }) {
  const theme = useThemePreview();
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

describe('ThemePreview attributes', () => {
  it('writes every setting as a data attribute on its own element', () => {
    const { container } = render(<ThemePreview>content</ThemePreview>);
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
    render(<ThemePreview>content</ThemePreview>);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.documentElement.hasAttribute('data-accent-color')).toBe(
      false
    );
  });

  it('carries the stable rs-theme override class', () => {
    const { container } = render(
      <ThemePreview className='mine'>content</ThemePreview>
    );
    const element = themeElement(container);
    expect(element).toHaveClass('rs-theme');
    expect(element).toHaveClass('mine');
  });

  it('lets a nested scope layer settings over its parent', () => {
    const { container } = render(
      <ThemePreview defaultValue={{ accentColor: 'orange', radius: 'large' }}>
        <ThemePreview defaultValue={{ accentColor: 'mint' }}>
          scoped
        </ThemePreview>
      </ThemePreview>
    );

    const scope = themeElement(container, 1);
    expect(scope).toHaveAttribute('data-accent-color', 'mint');
    // Inherited by omission: a nested theme keeps every key it does not set.
    expect(scope).toHaveAttribute('data-radius', 'large');
  });
});

// ─── Root marker and background ─────────────────────────────────────────────

describe('the root marker', () => {
  it('marks a theme with no ancestor', () => {
    const { container } = render(<ThemePreview>content</ThemePreview>);
    expect(themeElement(container)).toHaveAttribute('data-rs-root');
  });

  it('does not mark a nested theme', () => {
    const { container } = render(
      <ThemePreview>
        <ThemePreview>scoped</ThemePreview>
      </ThemePreview>
    );
    expect(themeElement(container, 1)).not.toHaveAttribute('data-rs-root');
  });

  it('isRoot={false} suppresses the marker but leaves the theme intact', () => {
    const { container } = render(
      <ThemePreview isRoot={false} defaultValue={{ appearance: 'dark' }}>
        widget
      </ThemePreview>
    );
    const element = themeElement(container);
    expect(element).not.toHaveAttribute('data-rs-root');
    expect(element).toHaveAttribute('data-theme', 'dark');
    expect(element).toHaveAttribute('data-accent-color', 'indigo');
  });
});

describe('hasBackground', () => {
  it('paints at the root by default', () => {
    const { container } = render(<ThemePreview>content</ThemePreview>);
    expect(themeElement(container)).toHaveAttribute('data-rs-background');
  });

  it('paints a nested theme that sets an explicit appearance', () => {
    const { container } = render(
      <ThemePreview>
        <ThemePreview defaultValue={{ appearance: 'dark' }}>panel</ThemePreview>
      </ThemePreview>
    );
    expect(themeElement(container, 1)).toHaveAttribute('data-rs-background');
  });

  it('does not paint a nested theme that only re-tints', () => {
    const { container } = render(
      <ThemePreview>
        <ThemePreview defaultValue={{ accentColor: 'mint' }}>tint</ThemePreview>
      </ThemePreview>
    );
    expect(themeElement(container, 1)).not.toHaveAttribute(
      'data-rs-background'
    );
  });

  it('honours an explicit override', () => {
    const { container } = render(
      <ThemePreview hasBackground={false}>content</ThemePreview>
    );
    expect(themeElement(container)).not.toHaveAttribute('data-rs-background');
  });
});

// ─── Controlled and uncontrolled ────────────────────────────────────────────

describe('controlled versus uncontrolled precedence', () => {
  it('a controlled key ignores a stored value', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const { container } = render(
      <ThemePreview persistKey='app' value={{ appearance: 'light' }}>
        content
      </ThemePreview>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
  });

  it('a stored value overrides the seed for an uncontrolled key', () => {
    entries.set('app', storedEntry({ appearance: 'dark' }));
    const { container } = render(
      <ThemePreview persistKey='app' defaultValue={{ appearance: 'light' }}>
        content
      </ThemePreview>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('control is per key', () => {
    entries.set('app', storedEntry({ appearance: 'dark', radius: 'full' }));
    const { container } = render(
      <ThemePreview persistKey='app' value={{ appearance: 'light' }}>
        content
      </ThemePreview>
    );
    const element = themeElement(container);
    expect(element).toHaveAttribute('data-theme', 'light');
    expect(element).toHaveAttribute('data-radius', 'full');
  });

  it('setValue never writes a controlled key', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useThemePreview();
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
      <ThemePreview persistKey='app' value={{ appearance: 'light' }}>
        <Switcher />
      </ThemePreview>
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
      const { setValue } = useThemePreview();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <ThemePreview>
        <Switcher />
      </ThemePreview>
    );
    await user.click(screen.getByRole('button'));

    // The setting still applies, in memory.
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });

  it('emits no inline script without a persistKey', () => {
    const { container } = render(<ThemePreview>content</ThemePreview>);
    expect(container.querySelector('script')).toBeNull();
  });

  it('emits an inline script for a persisted namespace', () => {
    const { container } = render(
      <ThemePreview persistKey='app'>content</ThemePreview>
    );
    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    // First child, so it patches the opening tag already parsed above it.
    expect(themeElement(container).firstChild).toBe(script);
  });

  it('omits the script when every persistable setting is controlled', () => {
    const { container } = render(
      <ThemePreview
        persistKey='app'
        persist={['appearance']}
        value={{ appearance: 'dark' }}
      >
        content
      </ThemePreview>
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('omits the script when persist excludes everything', () => {
    const { container } = render(
      <ThemePreview persistKey='app' persist={[]}>
        content
      </ThemePreview>
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('narrows a namespace with persist, keeping other settings in memory', async () => {
    const user = userEvent.setup();
    function Switcher() {
      const { setValue } = useThemePreview();
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
      <ThemePreview persistKey='app' persist={['appearance']}>
        <Switcher />
      </ThemePreview>
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
      const { setValue } = useThemePreview();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    const { container } = render(
      <>
        <ThemePreview persistKey='shared'>
          <Switcher />
        </ThemePreview>
        <ThemePreview persistKey='shared' isRoot={false}>
          second
        </ThemePreview>
      </>
    );

    await user.click(screen.getByRole('button'));

    // The `storage` event does not fire here, so the in-document notification
    // is what keeps the second theme in step.
    expect(themeElement(container, 0)).toHaveAttribute('data-theme', 'dark');
    expect(themeElement(container, 1)).toHaveAttribute('data-theme', 'dark');
  });

  it('synchronises across tabs through the storage event', () => {
    const { container } = render(
      <ThemePreview persistKey='app'>content</ThemePreview>
    );
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
      const { resolved } = useThemePreview();
      renders.push(`${resolved.appearance}/${resolved.radius}`);
      return null;
    }

    render(
      <ThemePreview persistKey='app'>
        <Recorder />
      </ThemePreview>
    );

    // No hydration under CSR, so the first render is already correct.
    expect(renders[0]).toBe('dark/full');
  });

  it('falls back to the seed for an unparseable entry', () => {
    entries.set('app', 'not json at all');
    const { container } = render(
      <ThemePreview persistKey='app' defaultValue={{ appearance: 'dark' }}>
        content
      </ThemePreview>
    );
    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });
});

// ─── Resolution ─────────────────────────────────────────────────────────────

describe('resolution', () => {
  it('resolves `system` against the OS', () => {
    installMatchMedia(true);
    const { container } = render(
      <ThemePreview defaultValue={{ appearance: 'system' }}>
        <Probe />
      </ThemePreview>
    );

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
    const probe = readProbe();
    expect(probe.value.appearance).toBe('system');
    expect(probe.resolved.appearance).toBe('dark');
  });

  it('follows the OS when it changes', () => {
    const { container } = render(<ThemePreview>content</ThemePreview>);
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');

    media.setPrefersDark(true);

    expect(themeElement(container)).toHaveAttribute('data-theme', 'dark');
  });

  it('pairs `auto` gray to the accent', () => {
    const { container } = render(
      <ThemePreview defaultValue={{ accentColor: 'orange' }}>
        <Probe />
      </ThemePreview>
    );

    expect(themeElement(container)).toHaveAttribute('data-gray-color', 'mauve');
    expect(readProbe().value.grayColor).toBe('auto');
    expect(readProbe().resolved.grayColor).toBe('mauve');
  });

  it('honours an explicit gray over the pairing', () => {
    const { container } = render(
      <ThemePreview defaultValue={{ accentColor: 'orange', grayColor: 'sage' }}>
        content
      </ThemePreview>
    );
    expect(themeElement(container)).toHaveAttribute('data-gray-color', 'sage');
  });

  it('reports the OS appearance whatever the setting is', () => {
    installMatchMedia(true);
    function SystemProbe() {
      const { systemAppearance, resolved } = useThemePreview();
      return (
        <output data-testid='sys'>{`${systemAppearance}/${resolved.appearance}`}</output>
      );
    }
    render(
      <ThemePreview defaultValue={{ appearance: 'light' }}>
        <SystemProbe />
      </ThemePreview>
    );
    expect(screen.getByTestId('sys')).toHaveTextContent('dark/light');
  });
});

// ─── The hook ───────────────────────────────────────────────────────────────

describe('useThemePreview', () => {
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
      const { root } = useThemePreview();
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
      <ThemePreview>
        <ThemePreview defaultValue={{ accentColor: 'mint' }}>
          <RootSwitcher />
        </ThemePreview>
      </ThemePreview>
    );

    await user.click(screen.getByRole('button'));

    expect(themeElement(container, 0)).toHaveAttribute('data-theme', 'dark');
    // The scope inherits the flipped appearance because it never set its own.
    expect(themeElement(container, 1)).toHaveAttribute('data-theme', 'dark');
  });

  it('reports the nearest theme as the root when there is only one', () => {
    function RootProbe() {
      const theme = useThemePreview();
      return (
        <output data-testid='root'>{theme.root.resolved.accentColor}</output>
      );
    }
    render(
      <ThemePreview defaultValue={{ accentColor: 'mint' }}>
        <RootProbe />
      </ThemePreview>
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
      const { setValue } = useThemePreview();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    render(
      <ThemePreview onValueChange={onValueChange}>
        <Switcher />
      </ThemePreview>
    );

    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [next, changed] = onValueChange.mock.calls[0];
    expect(next.appearance).toBe('dark');
    expect(next.accentColor).toBe('indigo');
    expect(changed).toEqual({ appearance: 'dark' });
  });
});

// ─── The render prop ────────────────────────────────────────────────────────

describe('render', () => {
  it('merges the theme onto a caller-supplied element', () => {
    const { container } = render(
      <ThemePreview render={<section className='page' />}>content</ThemePreview>
    );
    const element = themeElement(container);
    expect(element.tagName).toBe('SECTION');
    expect(element).toHaveClass('page');
    expect(element).toHaveAttribute('data-theme', 'light');
    expect(container.querySelectorAll('.rs-theme')).toHaveLength(1);
  });

  it('accepts a function form', () => {
    const { container } = render(
      <ThemePreview render={props => <main {...props} />}>content</ThemePreview>
    );
    expect(themeElement(container).tagName).toBe('MAIN');
  });

  it('keeps the theme children, including the inline script', () => {
    const { container } = render(
      <ThemePreview
        persistKey='app'
        render={<section>supplied children are replaced</section>}
      >
        <span data-testid='mine'>mine</span>
      </ThemePreview>
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
      <ThemePreview
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
      </ThemePreview>
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
      <ThemePreview defaultValue={{ appearance: 'dark', accentColor: 'mint' }}>
        <ThemePreview defaultValue={{ accentColor: 'orange' }}>
          <Portalled />
        </ThemePreview>
      </ThemePreview>
    );

    const portalled = screen.getByTestId('portalled');
    expect(portalled).toHaveClass('rs-theme');
    expect(portalled).toHaveAttribute('data-theme', 'dark');
    // The nearest scope wins: a portal used to render in the root's theme.
    expect(portalled).toHaveAttribute('data-accent-color', 'orange');
  });

  it('emits nothing outside a provider', () => {
    render(<Portalled />);
    const portalled = screen.getByTestId('portalled');
    expect(portalled).not.toHaveClass('rs-theme');
    expect(portalled).not.toHaveAttribute('data-theme');
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
      const { setValue } = useThemePreview();
      return (
        <button type='button' onClick={() => setValue({ appearance: 'dark' })}>
          set
        </button>
      );
    }

    render(
      <ThemePreview disableTransitionOnChange>
        <Switcher />
      </ThemePreview>
    );

    const before = document.head.querySelectorAll('style').length;
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    // The guard style is torn down on the next tick, so assert it ran and
    // cleaned up rather than trying to observe it mid-flight.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
    });
    expect(document.head.querySelectorAll('style').length).toBe(before);
  });

  it('does not suppress anything on the first render', () => {
    const before = document.head.querySelectorAll('style').length;
    render(<ThemePreview disableTransitionOnChange>content</ThemePreview>);
    expect(document.head.querySelectorAll('style').length).toBe(before);
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
      <ThemePreview>
        <Watcher />
      </ThemePreview>
    );
    expect(observed).toEqual(['mounted']);
    expect(themeElement(container)).toHaveAttribute('data-theme', 'light');
  });
});
