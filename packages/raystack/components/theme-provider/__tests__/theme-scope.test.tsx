import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../theme';

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
});
