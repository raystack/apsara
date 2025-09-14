import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { ColorPicker, useColorPicker } from '../color-picker-root';

describe('ColorPicker', () => {
  describe('Basic Rendering', () => {
    it('renders color picker root', () => {
      const { container } = render(
        <ColorPicker>
          <div>Test content</div>
        </ColorPicker>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      const flexContainer = container.firstChild;
      expect(flexContainer).toBeInTheDocument();
    });

    it('provides color picker context', () => {
      const TestComponent = () => {
        const context = useColorPicker();
        return (
          <div>
            <span data-testid='hue'>{context.hue}</span>
            <span data-testid='saturation'>{context.saturation}</span>
            <span data-testid='lightness'>{context.lightness}</span>
            <span data-testid='alpha'>{context.alpha}</span>
            <span data-testid='mode'>{context.mode}</span>
          </div>
        );
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('hue')).toBeInTheDocument();
      expect(screen.getByTestId('saturation')).toBeInTheDocument();
      expect(screen.getByTestId('lightness')).toBeInTheDocument();
      expect(screen.getByTestId('alpha')).toBeInTheDocument();
      expect(screen.getByTestId('mode')).toHaveTextContent('hex');
    });
  });

  describe('Default Values', () => {
    it('uses default white color', () => {
      const TestComponent = () => {
        const { hue, saturation, lightness, alpha } = useColorPicker();
        return (
          <div>
            <span data-testid='hue'>{hue}</span>
            <span data-testid='saturation'>{saturation}</span>
            <span data-testid='lightness'>{lightness}</span>
            <span data-testid='alpha'>{alpha}</span>
          </div>
        );
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      // White color in HSL should have high lightness and low saturation
      expect(screen.getByTestId('lightness')).toHaveTextContent('100');
      expect(screen.getByTestId('saturation')).toHaveTextContent('0');
      expect(screen.getByTestId('alpha')).toHaveTextContent('1');
    });

    it('accepts custom default value', () => {
      const TestComponent = () => {
        const { saturation, lightness } = useColorPicker();
        return (
          <div>
            <span data-testid='saturation'>{Math.round(saturation)}</span>
            <span data-testid='lightness'>{Math.round(lightness)}</span>
          </div>
        );
      };

      render(
        <ColorPicker defaultValue='#ff0000'>
          <TestComponent />
        </ColorPicker>
      );

      // Red color should have high saturation and medium lightness
      expect(screen.getByTestId('saturation')).toHaveTextContent('100');
      expect(screen.getByTestId('lightness')).toHaveTextContent('50');
    });

    it('uses default hex mode', () => {
      const TestComponent = () => {
        const { mode } = useColorPicker();
        return <span data-testid='mode'>{mode}</span>;
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('hex');
    });

    it('accepts custom default mode', () => {
      const TestComponent = () => {
        const { mode } = useColorPicker();
        return <span data-testid='mode'>{mode}</span>;
      };

      render(
        <ColorPicker defaultMode='rgb'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('rgb');
    });
  });

  describe('Controlled Values', () => {
    it('accepts controlled color value', () => {
      const TestComponent = () => {
        const { hue, saturation, lightness } = useColorPicker();
        return (
          <div>
            <span data-testid='hue'>{Math.round(hue)}</span>
            <span data-testid='saturation'>{Math.round(saturation)}</span>
            <span data-testid='lightness'>{Math.round(lightness)}</span>
          </div>
        );
      };

      render(
        <ColorPicker value='#00ff00'>
          <TestComponent />
        </ColorPicker>
      );

      // Green color properties
      expect(screen.getByTestId('hue')).toHaveTextContent('120');
      expect(screen.getByTestId('saturation')).toHaveTextContent('100');
      expect(screen.getByTestId('lightness')).toHaveTextContent('50');
    });

    it('accepts controlled mode', () => {
      const TestComponent = () => {
        const { mode } = useColorPicker();
        return <span data-testid='mode'>{mode}</span>;
      };

      render(
        <ColorPicker mode='hsl'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('hsl');
    });
  });

  describe('Color Updates', () => {
    it('calls onValueChange when color changes', () => {
      const onValueChange = vi.fn();

      const TestComponent = () => {
        const { setColor } = useColorPicker();
        return (
          <button onClick={() => setColor({ h: 240, s: 100, l: 50 })}>
            Change Color
          </button>
        );
      };

      render(
        <ColorPicker onValueChange={onValueChange}>
          <TestComponent />
        </ColorPicker>
      );

      const button = screen.getByText('Change Color');
      fireEvent.click(button);

      expect(onValueChange).toHaveBeenCalled();
    });

    it('updates internal color state', () => {
      const TestComponent = () => {
        const { hue, setColor } = useColorPicker();
        return (
          <div>
            <span data-testid='hue'>{Math.round(hue)}</span>
            <button onClick={() => setColor({ h: 180 })}>Change Hue</button>
          </div>
        );
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      const button = screen.getByText('Change Hue');
      fireEvent.click(button);

      expect(screen.getByTestId('hue')).toHaveTextContent('180');
    });
  });

  describe('Mode Updates', () => {
    it('calls onModeChange when mode changes', () => {
      const onModeChange = vi.fn();

      const TestComponent = () => {
        const { setMode } = useColorPicker();
        return <button onClick={() => setMode('rgb')}>Change Mode</button>;
      };

      render(
        <ColorPicker onModeChange={onModeChange}>
          <TestComponent />
        </ColorPicker>
      );

      const button = screen.getByText('Change Mode');
      fireEvent.click(button);

      expect(onModeChange).toHaveBeenCalledWith('rgb');
    });

    it('updates internal mode state', () => {
      const TestComponent = () => {
        const { mode, setMode } = useColorPicker();
        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button onClick={() => setMode('hsl')}>Change Mode</button>
          </div>
        );
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      const button = screen.getByText('Change Mode');
      fireEvent.click(button);

      expect(screen.getByTestId('mode')).toHaveTextContent('hsl');
    });
  });

  describe('Alpha Channel', () => {
    it('handles alpha values', () => {
      const TestComponent = () => {
        const { alpha } = useColorPicker();
        return <span data-testid='alpha'>{alpha}</span>;
      };

      render(
        <ColorPicker defaultValue='rgba(255, 0, 0, 0.5)'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('alpha')).toHaveTextContent('0.5');
    });

    it('updates alpha channel', () => {
      const TestComponent = () => {
        const { alpha, setColor } = useColorPicker();
        return (
          <div>
            <span data-testid='alpha'>{alpha}</span>
            <button onClick={() => setColor({ alpha: 0.75 })}>
              Change Alpha
            </button>
          </div>
        );
      };

      render(
        <ColorPicker>
          <TestComponent />
        </ColorPicker>
      );

      const button = screen.getByText('Change Alpha');
      fireEvent.click(button);

      expect(screen.getByTestId('alpha')).toHaveTextContent('0.75');
    });
  });

  describe('Error Handling', () => {
    it('throws error when useColorPicker is used outside provider', () => {
      const TestComponent = () => {
        useColorPicker();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useColorPicker must be used within a ColorPickerProvider'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Component Composition', () => {
    it('supports component composition', () => {
      render(
        <ColorPicker>
          <ColorPicker.Area />
          <ColorPicker.Hue />
          <ColorPicker.Alpha />
          <ColorPicker.Input />
          <ColorPicker.Mode />
        </ColorPicker>
      );

      // Components should render without errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards props to Flex component', () => {
      render(
        <ColorPicker data-testid='color-picker' className='custom-picker'>
          <div>Content</div>
        </ColorPicker>
      );

      const picker = screen.getByTestId('color-picker');
      expect(picker).toBeInTheDocument();
      expect(picker).toHaveClass('custom-picker');
    });
  });

  describe('Color Format Handling', () => {
    it('handles hex colors', () => {
      const TestComponent = () => {
        const { hue } = useColorPicker();
        return <span data-testid='hue'>{Math.round(hue)}</span>;
      };

      render(
        <ColorPicker value='#ff0000'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('hue')).toHaveTextContent('0');
    });

    it('handles RGB colors', () => {
      const TestComponent = () => {
        const { hue } = useColorPicker();
        return <span data-testid='hue'>{Math.round(hue)}</span>;
      };

      render(
        <ColorPicker value='rgb(0, 255, 0)'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('hue')).toHaveTextContent('120');
    });

    it('handles HSL colors', () => {
      const TestComponent = () => {
        const { hue, saturation, lightness } = useColorPicker();
        return (
          <div>
            <span data-testid='hue'>{Math.round(hue)}</span>
            <span data-testid='saturation'>{Math.round(saturation)}</span>
            <span data-testid='lightness'>{Math.round(lightness)}</span>
          </div>
        );
      };

      render(
        <ColorPicker value='hsl(240, 100%, 50%)'>
          <TestComponent />
        </ColorPicker>
      );

      expect(screen.getByTestId('hue')).toHaveTextContent('240');
      expect(screen.getByTestId('saturation')).toHaveTextContent('100');
      expect(screen.getByTestId('lightness')).toHaveTextContent('50');
    });
  });
});
