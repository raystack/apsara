import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from '../theme';

// jsdom doesn't ship these; the root ThemeProvider needs them on mount.
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
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

const localStorageMock = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-style');
  document.documentElement.removeAttribute('data-accent-color');
  document.documentElement.removeAttribute('data-gray-color');
});

afterEach(() => {
  vi.clearAllMocks();
});

// Nested usage: ThemeProvider renders a scoped wrapper with data-* attrs.
describe('ThemeProvider (scoped)', () => {
  it('renders a div wrapper with children when nested', () => {
    render(
      <ThemeProvider>
        <ThemeProvider forcedTheme='dark'>
          <span data-testid='child'>inside</span>
        </ThemeProvider>
      </ThemeProvider>
    );

    const child = screen.getByTestId('child');
    expect(child.parentElement?.tagName).toBe('DIV');
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('writes data-theme on the scoped wrapper', () => {
    render(
      <ThemeProvider>
        <ThemeProvider forcedTheme='dark'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('omits data attributes when their props are not provided', () => {
    render(
      <ThemeProvider>
        <ThemeProvider>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
    );

    const wrapper = screen.getByTestId('child').parentElement!;
    expect(wrapper).not.toHaveAttribute('data-theme');
    expect(wrapper).not.toHaveAttribute('data-accent-color');
    expect(wrapper).not.toHaveAttribute('data-gray-color');
    expect(wrapper).not.toHaveAttribute('data-style');
  });

  it('writes every supported data attribute', () => {
    render(
      <ThemeProvider>
        <ThemeProvider
          forcedTheme='light'
          accentColor='orange'
          grayColor='mauve'
          style='traditional'
        >
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
    );

    const wrapper = screen.getByTestId('child').parentElement!;
    expect(wrapper).toHaveAttribute('data-theme', 'light');
    expect(wrapper).toHaveAttribute('data-accent-color', 'orange');
    expect(wrapper).toHaveAttribute('data-gray-color', 'mauve');
    expect(wrapper).toHaveAttribute('data-style', 'traditional');
  });

  it('does not propagate scope attrs to the document root', () => {
    render(
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider forcedTheme='dark' accentColor='orange'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider
        defaultTheme='dark'
        enableSystem={false}
        accentColor='indigo'
      >
        <ThemeProvider forcedTheme='light' accentColor='orange'>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider forcedTheme='dark'>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('set'));
    // Stateless scope owns no theme state, so setTheme passes through to root.
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});

// `Theme` is the canonical export; `ThemeProvider` is a back-compat alias.
describe('Theme alias compatibility', () => {
  it('exports Theme and ThemeProvider as the same value', async () => {
    const { Theme, ThemeProvider: TP } = await import('../theme');
    expect(TP).toBe(Theme);
  });
});

// Persistent scope: `storageKey` on a nested `<Theme>` enables localStorage-
// backed state. Descendants read and write the scope's theme via `useTheme()`,
// which returns layered state (scope's theme/setTheme, parent's other fields).
describe('ThemeProvider (persistent scope)', () => {
  it('reads the initial scope theme from localStorage', () => {
    localStorageMock.getItem.mockImplementation((k: string) =>
      k === 'scope-1' ? 'dark' : null
    );

    render(
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-1'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('falls back to defaultTheme when storage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-2' defaultTheme='dark'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark'
    );
  });

  it('omits data-theme entirely when storage and defaultTheme are both empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-3'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-4' forcedTheme='light'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-5'>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-6'>
          <Probe />
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-7'>
          <span data-testid='child' />
        </ThemeProvider>
      </ThemeProvider>
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
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        <ThemeProvider storageKey='scope-outer'>
          <ThemeProvider storageKey='scope-inner'>
            <span data-testid='inner' />
          </ThemeProvider>
        </ThemeProvider>
      </ThemeProvider>
    );

    const innerWrapper = screen.getByTestId('inner').parentElement!;
    expect(innerWrapper).toHaveAttribute('data-theme', 'light');
    // Outer wrapper is the grandparent.
    expect(innerWrapper.parentElement).toHaveAttribute('data-theme', 'dark');
  });
});
