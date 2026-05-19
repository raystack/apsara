import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeSwitcher } from '../switcher';
import { Theme, useTheme } from '../theme';

// jsdom doesn't ship these; the root Theme needs them on mount.
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

beforeEach(() => {
  // mockReset clears implementations too — vital for isolation since tests
  // set `mockReturnValue`/`mockImplementation` and mockClear alone would let
  // those leak into subsequent tests.
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-style');
  document.documentElement.removeAttribute('data-accent-color');
  document.documentElement.removeAttribute('data-gray-color');
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Root mode ──────────────────────────────────────────────────────────────

describe('Theme (root)', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <Theme>
          <div>Test content</div>
        </Theme>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('provides default theme context', () => {
      const TestComponent = () => {
        const { theme, themes } = useTheme();
        return (
          <div>
            <span data-testid='current-theme'>{theme}</span>
            <span data-testid='available-themes'>{themes.join(',')}</span>
          </div>
        );
      };

      render(
        <Theme>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('available-themes')).toHaveTextContent(
        'light,dark,system'
      );
    });

    it('applies default theme attributes to document', () => {
      render(
        <Theme>
          <div>Test</div>
        </Theme>
      );

      expect(document.documentElement.getAttribute('data-style')).toBe(
        'modern'
      );
      expect(document.documentElement.getAttribute('data-accent-color')).toBe(
        'indigo'
      );
      expect(document.documentElement.getAttribute('data-gray-color')).toBe(
        'gray'
      );
    });
  });

  describe('Configuration', () => {
    it('accepts custom default theme', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <span data-testid='theme'>{theme}</span>;
      };

      render(
        <Theme defaultTheme='dark' enableSystem={false}>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('applies custom style attributes', () => {
      render(
        <Theme style='traditional' accentColor='mint' grayColor='slate'>
          <div>Test</div>
        </Theme>
      );

      expect(document.documentElement.getAttribute('data-style')).toBe(
        'traditional'
      );
      expect(document.documentElement.getAttribute('data-accent-color')).toBe(
        'mint'
      );
      expect(document.documentElement.getAttribute('data-gray-color')).toBe(
        'slate'
      );
    });

    it('handles forced theme', () => {
      const TestComponent = () => {
        const { theme, forcedTheme } = useTheme();
        return (
          <div>
            <span data-testid='theme'>{theme}</span>
            <span data-testid='forced'>{forcedTheme}</span>
          </div>
        );
      };

      render(
        <Theme forcedTheme='dark'>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('forced')).toHaveTextContent('dark');
    });
  });

  describe('useTheme', () => {
    it('provides theme context values', () => {
      const TestComponent = () => {
        const context = useTheme();
        return (
          <div>
            <span data-testid='has-set-theme'>
              {typeof context.setTheme === 'function' ? 'true' : 'false'}
            </span>
            <span data-testid='has-themes'>
              {Array.isArray(context.themes) ? 'true' : 'false'}
            </span>
          </div>
        );
      };

      render(
        <Theme>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('has-set-theme')).toHaveTextContent('true');
      expect(screen.getByTestId('has-themes')).toHaveTextContent('true');
    });

    it('allows theme changes', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Set Dark Theme</button>;
      };

      render(
        <Theme>
          <TestComponent />
        </Theme>
      );

      fireEvent.click(screen.getByText('Set Dark Theme'));

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('returns default context when used outside any provider', () => {
      const TestComponent = () => {
        const { setTheme, themes } = useTheme();
        return (
          <div>
            <span data-testid='has-set-theme'>
              {typeof setTheme === 'function' ? 'true' : 'false'}
            </span>
            <span data-testid='themes-length'>{themes.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('has-set-theme')).toHaveTextContent('true');
      expect(screen.getByTestId('themes-length')).toHaveTextContent('0');
    });
  });

  describe('resolvedTheme', () => {
    it('reflects forcedTheme when set', () => {
      const Probe = () => {
        const { resolvedTheme } = useTheme();
        return <span data-testid='resolved'>{resolvedTheme}</span>;
      };

      render(
        <Theme defaultTheme='light' enableSystem={false} forcedTheme='dark'>
          <Probe />
        </Theme>
      );

      expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    });
  });

  describe('onThemeChange', () => {
    it('does not fire on initial mount', async () => {
      const handler = vi.fn();

      render(
        <Theme
          defaultTheme='light'
          enableSystem={false}
          onThemeChange={handler}
        >
          <div />
        </Theme>
      );

      // Settle any post-mount effects (media-query listener + re-render).
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'light'
        );
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it('fires when setTheme changes the theme', () => {
      const handler = vi.fn();
      const Probe = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>set</button>;
      };

      render(
        <Theme
          defaultTheme='light'
          enableSystem={false}
          onThemeChange={handler}
        >
          <Probe />
        </Theme>
      );

      fireEvent.click(screen.getByText('set'));
      expect(handler).toHaveBeenCalledWith('dark', 'dark');
    });

    it('does not over-fire when the consumer passes an inline callback', () => {
      const handler = vi.fn();
      const Tree = () => {
        const [count, setCount] = useState(0);
        return (
          <Theme
            defaultTheme='light'
            enableSystem={false}
            // Inline arrow: a fresh function identity every render.
            onThemeChange={(t, r) => handler(t, r)}
          >
            <button onClick={() => setCount(c => c + 1)}>bump {count}</button>
          </Theme>
        );
      };

      render(<Tree />);
      fireEvent.click(screen.getByText(/bump/));
      fireEvent.click(screen.getByText(/bump/));

      // Theme never changed; consumer re-renders shouldn't drive the callback.
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('System Theme Detection', () => {
    it('enables system theme by default', () => {
      const TestComponent = () => {
        const { themes, systemTheme } = useTheme();
        return (
          <div>
            <span data-testid='has-system'>
              {themes.includes('system') ? 'true' : 'false'}
            </span>
            <span data-testid='system-theme'>{systemTheme || 'none'}</span>
          </div>
        );
      };

      render(
        <Theme>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('has-system')).toHaveTextContent('true');
    });

    it('can disable system theme', () => {
      const TestComponent = () => {
        const { themes } = useTheme();
        return <span data-testid='themes'>{themes.join(',')}</span>;
      };

      render(
        <Theme enableSystem={false}>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('themes')).toHaveTextContent('light,dark');
    });
  });

  describe('Local Storage Integration', () => {
    it('reads initial theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <span data-testid='theme'>{theme}</span>;
      };

      render(
        <Theme>
          <TestComponent />
        </Theme>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('uses custom storage key', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('light')}>Set Theme</button>;
      };

      render(
        <Theme storageKey='custom-theme'>
          <TestComponent />
        </Theme>
      );

      fireEvent.click(screen.getByText('Set Theme'));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'custom-theme',
        'light'
      );
    });
  });
});

// ─── Scoped mode (stateless) ────────────────────────────────────────────────

describe('Theme (scoped)', () => {
  it('renders a div wrapper with children when nested with overrides', () => {
    render(
      <Theme>
        <Theme forcedTheme='dark'>
          <span data-testid='child'>inside</span>
        </Theme>
      </Theme>
    );

    const child = screen.getByTestId('child');
    expect(child.parentElement?.tagName).toBe('DIV');
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('writes data-theme on the scoped wrapper', () => {
    render(
      <Theme>
        <Theme forcedTheme='dark'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('passes children through unchanged when no override props are provided', () => {
    // No-op nesting: a nested `<Theme>` with no override props should not
    // introduce a wrapper element. This preserves the pre-PR behavior for
    // consumers who accidentally nest providers.
    const { container } = render(
      <Theme>
        <Theme>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    // The child's parent is the test container — no scope wrapper in between.
    expect(screen.getByTestId('child').parentElement).toBe(container);
  });

  it('writes every supported data attribute', () => {
    render(
      <Theme>
        <Theme
          forcedTheme='light'
          accentColor='orange'
          grayColor='mauve'
          style='traditional'
        >
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    const wrapper = screen.getByTestId('child').parentElement!;
    expect(wrapper).toHaveAttribute('data-theme', 'light');
    expect(wrapper).toHaveAttribute('data-accent-color', 'orange');
    expect(wrapper).toHaveAttribute('data-gray-color', 'mauve');
    expect(wrapper).toHaveAttribute('data-style', 'traditional');
  });

  it('does not propagate scope attrs to the document root', () => {
    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme forcedTheme='dark' accentColor='orange'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    // Root provider drives <html>'s attrs; scope only changes its own wrapper.
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-accent-color')).toBe(
      'indigo'
    );
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });
});

// `useTheme()` returns layered state inside a scope: scope-relevant fields
// (resolvedTheme, accentColor, etc.) reflect the scope's overrides; the rest
// is inherited from the root.
describe('useTheme inside a stateless scope', () => {
  it('layers scope overrides onto the root state', () => {
    const Probe = () => {
      const { theme, resolvedTheme, accentColor, grayColor } = useTheme();
      return (
        <div>
          <span data-testid='theme'>{theme}</span>
          <span data-testid='resolved'>{resolvedTheme}</span>
          <span data-testid='accent'>{accentColor}</span>
          <span data-testid='gray'>{grayColor}</span>
        </div>
      );
    };

    render(
      <Theme defaultTheme='dark' enableSystem={false} accentColor='indigo'>
        <Theme forcedTheme='light' accentColor='orange'>
          <Probe />
        </Theme>
      </Theme>
    );

    // theme is the user's stored preference — stateless scope doesn't own it.
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    // resolvedTheme reflects what's displayed for this subtree.
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    // Overridden field comes from the scope.
    expect(screen.getByTestId('accent')).toHaveTextContent('orange');
    // Non-overridden field inherits from the root.
    expect(screen.getByTestId('gray')).toHaveTextContent('gray');
  });

  it('setTheme inside a stateless scope writes to the root storage', () => {
    const Probe = () => {
      const { setTheme } = useTheme();
      return <button onClick={() => setTheme('dark')}>set</button>;
    };

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme forcedTheme='dark'>
          <Probe />
        </Theme>
      </Theme>
    );

    fireEvent.click(screen.getByText('set'));
    // Stateless scope owns no theme state, so setTheme passes through to root.
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});

// `Theme` is the canonical export; `ThemeProvider` is a back-compat alias.
describe('Theme alias compatibility', () => {
  it('exports Theme and ThemeProvider as the same value', async () => {
    const { Theme: T, ThemeProvider: TP } = await import('../theme');
    expect(TP).toBe(T);
  });
});

// ─── Scoped mode (persistent) ───────────────────────────────────────────────

// Persistent scope: `storageKey` on a nested `<Theme>` enables localStorage-
// backed state. Descendants read and write the scope's theme via `useTheme()`,
// which returns layered state (scope's theme/setTheme, parent's other fields).
describe('Theme (persistent scope)', () => {
  it('reads the initial scope theme from localStorage', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-1' ? 'dark' : null
    );

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-1'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('falls back to defaultTheme when storage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-2' defaultTheme='dark'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('omits data-theme entirely when storage and defaultTheme are both empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-3'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    // No data-theme on wrapper → CSS inherits from parent.
    expect(screen.getByTestId('child').parentElement).not.toHaveAttribute(
      'data-theme'
    );
  });

  it('forcedTheme wins over stored value (and is not persisted)', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-4' ? 'dark' : null
    );

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-4' forcedTheme='light'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    // Displayed = forcedTheme; storage untouched.
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'light'
    );
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
      'scope-4',
      'light'
    );
  });

  it('useTheme inside a persistent scope returns the scope theme and setter', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-5' ? 'dark' : null
    );

    const Probe = () => {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <span data-testid='theme'>{theme ?? 'undefined'}</span>
          <button onClick={() => setTheme('light')}>set light</button>
        </div>
      );
    };

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-5'>
          <Probe />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByText('set light'));

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    // setTheme writes to the scope's key, not the root's.
    expect(localStorageMock.setItem).toHaveBeenCalledWith('scope-5', 'light');
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith('theme', 'light');
  });

  it('clearing via setTheme(undefined) removes the storage entry', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-6' ? 'dark' : null
    );

    const Probe = () => {
      const { setTheme } = useTheme();
      return <button onClick={() => setTheme(undefined)}>clear</button>;
    };

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-6'>
          <Probe />
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    fireEvent.click(screen.getByText('clear'));

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('scope-6');
    expect(screen.getByTestId('child').parentElement).not.toHaveAttribute(
      'data-theme'
    );
  });

  it('syncs across tabs via the storage event', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-7' ? 'dark' : null
    );

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-7'>
          <span data-testid='child' />
        </Theme>
      </Theme>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );

    // Another tab updated the same key.
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'scope-7',
          newValue: 'light',
          oldValue: 'dark'
        })
      );
    });

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'light'
    );
  });

  it('nested persistent scopes each manage their own key', () => {
    localStorageMock.getItem.mockImplementation((k: string) => {
      if (k === 'scope-outer') return 'dark';
      if (k === 'scope-inner') return 'light';
      return null;
    });

    render(
      <Theme defaultTheme='light' enableSystem={false}>
        <Theme storageKey='scope-outer'>
          <Theme storageKey='scope-inner'>
            <span data-testid='inner' />
          </Theme>
        </Theme>
      </Theme>
    );

    const innerWrapper = screen.getByTestId('inner').parentElement!;
    expect(innerWrapper).toHaveAttribute('data-theme', 'light');
    // Outer wrapper is the grandparent.
    expect(innerWrapper.parentElement).toHaveAttribute('data-theme', 'dark');
  });
});

// ─── ThemeSwitcher ──────────────────────────────────────────────────────────

describe('ThemeSwitcher', () => {
  describe('Basic Rendering', () => {
    it('renders theme switcher', () => {
      render(
        <Theme defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher />
        </Theme>
      );

      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('shows moon icon for light theme', () => {
      render(
        <Theme defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher />
        </Theme>
      );

      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('shows sun icon for dark theme', () => {
      render(
        <Theme defaultTheme='dark' enableSystem={false}>
          <ThemeSwitcher />
        </Theme>
      );

      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies custom size', () => {
      render(
        <Theme defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher size={40} />
        </Theme>
      );

      const icon = document.querySelector('svg');
      expect(icon).toHaveAttribute('width', '40');
      expect(icon).toHaveAttribute('height', '40');
    });
  });

  describe('Theme Switching', () => {
    it('switches from dark to light', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <span data-testid='current-theme'>{theme}</span>
            <ThemeSwitcher />
          </div>
        );
      };

      render(
        <Theme defaultTheme='dark' enableSystem={false}>
          <TestComponent />
        </Theme>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      const icon = document.querySelector('svg');
      fireEvent.click(icon!);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });
});
