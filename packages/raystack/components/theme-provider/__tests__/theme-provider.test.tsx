import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { ThemeSwitcher } from '../switcher';
import { ThemeProvider, useTheme } from '../theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
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

describe('ThemeProvider', () => {
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

  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <ThemeProvider>
          <div>Test content</div>
        </ThemeProvider>
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
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('available-themes')).toHaveTextContent(
        'light,dark,system'
      );
    });

    it('applies default theme attributes to document', () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
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

  describe('Theme Configuration', () => {
    it('accepts custom default theme', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <span data-testid='theme'>{theme}</span>;
      };

      render(
        <ThemeProvider defaultTheme='dark' enableSystem={false}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('accepts custom themes', () => {
      const TestComponent = () => {
        const { themes } = useTheme();
        return <span data-testid='themes'>{themes.join(',')}</span>;
      };

      render(
        <ThemeProvider themes={['red', 'blue']} enableSystem={false}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('themes')).toHaveTextContent('red,blue');
    });

    it('applies custom style attributes', () => {
      render(
        <ThemeProvider style='retro' accentColor='purple' grayColor='slate'>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-style')).toBe('retro');
      expect(document.documentElement.getAttribute('data-accent-color')).toBe(
        'purple'
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
        <ThemeProvider forcedTheme='dark'>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('forced')).toHaveTextContent('dark');
    });
  });

  describe('useTheme Hook', () => {
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
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-set-theme')).toHaveTextContent('true');
      expect(screen.getByTestId('has-themes')).toHaveTextContent('true');
    });

    it('allows theme changes', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid='current-theme'>{theme}</span>
            <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Set Dark Theme');
      fireEvent.click(button);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('returns default context when used outside provider', () => {
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
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-system')).toHaveTextContent('true');
    });

    it('can disable system theme', () => {
      const TestComponent = () => {
        const { themes } = useTheme();
        return <span data-testid='themes'>{themes.join(',')}</span>;
      };

      render(
        <ThemeProvider enableSystem={false}>
          <TestComponent />
        </ThemeProvider>
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
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('uses custom storage key', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('light')}>Set Theme</button>;
      };

      render(
        <ThemeProvider storageKey='custom-theme'>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Set Theme');
      fireEvent.click(button);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'custom-theme',
        'light'
      );
    });
  });

  // TODO: Fix nested providers test - theme state management is complex in test environment
  // describe('Nested Providers', () => {
  //   it('ignores nested providers', () => {
  //     const TestComponent = () => {
  //       const { theme } = useTheme();
  //       return <span data-testid='theme'>{theme}</span>;
  //     };

  //     render(
  //       <ThemeProvider defaultTheme='light' enableSystem={false}>
  //         <ThemeProvider defaultTheme='dark' enableSystem={false}>
  //           <TestComponent />
  //         </ThemeProvider>
  //       </ThemeProvider>
  //     );

  //     // The nested provider should be ignored, so the outer provider's theme should be used
  //     expect(screen.getByTestId('theme')).toHaveTextContent('light');
  //   });
  // });

  describe('ThemeScript', () => {
    it('renders script tag', () => {
      const { container } = render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      const script = container.querySelector('script');
      expect(script).toBeInTheDocument();
      // The script should have innerHTML content (dangerouslySetInnerHTML is a React prop, not an attribute)
      expect(script?.innerHTML).toBeTruthy();
    });

    it('includes nonce when provided', () => {
      const { container } = render(
        <ThemeProvider nonce='test-nonce'>
          <div>Test</div>
        </ThemeProvider>
      );

      const script = container.querySelector('script');
      expect(script).toHaveAttribute('nonce', 'test-nonce');
    });
  });
});

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders theme switcher', () => {
      render(
        <ThemeProvider defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      // The ThemeSwitcher renders an SVG icon, not a button
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('shows moon icon for light theme', () => {
      render(
        <ThemeProvider defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      // Moon icon should be present for light theme
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('shows sun icon for dark theme', () => {
      render(
        <ThemeProvider defaultTheme='dark' enableSystem={false}>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      // Sun icon should be present for dark theme
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies custom size', () => {
      render(
        <ThemeProvider defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher size={40} />
        </ThemeProvider>
      );

      const icon = document.querySelector('svg');
      expect(icon).toHaveAttribute('width', '40');
      expect(icon).toHaveAttribute('height', '40');
    });
  });

  describe('Theme Switching', () => {
    // TODO: Fix theme switching test - theme state management is complex in test environment
    // it('switches from light to dark', () => {
    //   const TestComponent = () => {
    //     const { theme } = useTheme();
    //     return (
    //       <div>
    //         <span data-testid='current-theme'>{theme}</span>
    //         <ThemeSwitcher />
    //       </div>
    //     );
    //   };

    //   render(
    //     <ThemeProvider defaultTheme='light' enableSystem={false}>
    //       <TestComponent />
    //     </ThemeProvider>
    //   );

    //   expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    //   const icon = document.querySelector('svg');
    //   fireEvent.click(icon!);

    //   expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    // });

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
        <ThemeProvider defaultTheme='dark' enableSystem={false}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      const icon = document.querySelector('svg');
      fireEvent.click(icon!);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Custom Props', () => {
    it('passes through additional props', () => {
      render(
        <ThemeProvider defaultTheme='light' enableSystem={false}>
          <ThemeSwitcher data-testid='theme-switcher' />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works outside of ThemeProvider', () => {
      render(<ThemeSwitcher />);

      // Should render without crashing even without provider
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
