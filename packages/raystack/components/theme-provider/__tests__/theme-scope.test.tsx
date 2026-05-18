import { fireEvent, render, screen } from '@testing-library/react';
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
};

beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
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

// `useTheme()` reads context, and scope mode is stateless (no new context),
// so descendants of a scope still see the root provider's state.
describe('useTheme inside a scope', () => {
  it('returns the root provider state, not the scope', () => {
    const Probe = () => {
      const { resolvedTheme } = useTheme();
      return <span data-testid='probe'>{resolvedTheme ?? 'none'}</span>;
    };

    render(
      <ThemeProvider defaultTheme='dark' enableSystem={false}>
        <ThemeProvider forcedTheme='light'>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
  });

  it('exposes the root setTheme to scope descendants', () => {
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
    // setTheme on a scope descendant writes through to the root's storage.
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
