import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../color-picker';

// Mock ResizeObserver for tests
beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));
});

describe('ColorPicker', () => {
  describe('ColorPicker Root', () => {
    it('renders color picker root with children', () => {
      const { container } = render(
        <ColorPicker>
          <div>Test content</div>
        </ColorPicker>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      const flexContainer = container.firstChild;
      expect(flexContainer).toBeInTheDocument();
    });

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

  describe('ColorPicker.Area', () => {
    it('renders color picker area component', () => {
      render(
        <ColorPicker>
          <ColorPicker.Area data-testid='color-area' />
        </ColorPicker>
      );

      const area = screen.getByTestId('color-area');
      expect(area).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ColorPicker>
          <ColorPicker.Area className='custom-area' data-testid='color-area' />
        </ColorPicker>
      );

      const area = screen.getByTestId('color-area');
      expect(area).toHaveClass('custom-area');
    });

    it('renders with background gradient', () => {
      render(
        <ColorPicker>
          <ColorPicker.Area data-testid='color-area' />
        </ColorPicker>
      );

      const area = screen.getByTestId('color-area');
      expect(area).toHaveStyle(
        'background: linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)), linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)), hsl(0, 100%, 50%)'
      );
    });
  });

  describe('ColorPicker.Hue', () => {
    it('renders hue slider component', () => {
      render(
        <ColorPicker>
          <ColorPicker.Hue data-testid='hue-slider' />
        </ColorPicker>
      );

      const hueSlider = screen.getByTestId('hue-slider');
      expect(hueSlider).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ColorPicker>
          <ColorPicker.Hue className='custom-hue' data-testid='hue-slider' />
        </ColorPicker>
      );

      const hueSlider = screen.getByTestId('hue-slider');
      expect(hueSlider).toHaveClass('custom-hue');
    });

    it('renders with proper structure', () => {
      render(
        <ColorPicker>
          <ColorPicker.Hue data-testid='hue-slider' />
        </ColorPicker>
      );

      const hueSlider = screen.getByTestId('hue-slider');
      expect(hueSlider).toBeInTheDocument();

      // Check that the slider has child elements (track and thumb)
      expect(hueSlider.children.length).toBeGreaterThan(0);
    });
  });

  describe('ColorPicker.Alpha', () => {
    it('renders alpha slider component', () => {
      render(
        <ColorPicker>
          <ColorPicker.Alpha data-testid='alpha-slider' />
        </ColorPicker>
      );

      const alphaSlider = screen.getByTestId('alpha-slider');
      expect(alphaSlider).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ColorPicker>
          <ColorPicker.Alpha
            className='custom-alpha'
            data-testid='alpha-slider'
          />
        </ColorPicker>
      );

      const alphaSlider = screen.getByTestId('alpha-slider');
      expect(alphaSlider).toHaveClass('custom-alpha');
    });

    it('renders with proper structure', () => {
      render(
        <ColorPicker>
          <ColorPicker.Alpha data-testid='alpha-slider' />
        </ColorPicker>
      );

      const alphaSlider = screen.getByTestId('alpha-slider');
      expect(alphaSlider).toBeInTheDocument();

      // Check that the slider has child elements (track and thumb)
      expect(alphaSlider.children.length).toBeGreaterThan(0);
    });
  });

  describe('ColorPicker.Input', () => {
    it('renders input field component', () => {
      render(
        <ColorPicker>
          <ColorPicker.Input data-testid='color-input' />
        </ColorPicker>
      );

      const input = screen.getByTestId('color-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('readonly');
    });

    it('displays color value in default mode', () => {
      render(
        <ColorPicker defaultValue='#ff0000'>
          <ColorPicker.Input data-testid='color-input' />
        </ColorPicker>
      );

      const input = screen.getByTestId('color-input');
      expect(input).toHaveValue('#FF0000');
    });

    it('updates value when color changes', () => {
      const { rerender } = render(
        <ColorPicker value='#ff0000'>
          <ColorPicker.Input data-testid='color-input' />
        </ColorPicker>
      );

      let input = screen.getByTestId('color-input');
      expect(input).toHaveValue('#FF0000');

      rerender(
        <ColorPicker value='#00ff00'>
          <ColorPicker.Input data-testid='color-input' />
        </ColorPicker>
      );

      input = screen.getByTestId('color-input');
      expect(input).toHaveValue('#00FF00');
    });
  });

  describe('ColorPicker.Mode', () => {
    it('renders mode selector component', () => {
      render(
        <ColorPicker>
          <ColorPicker.Mode data-testid='mode-selector' />
        </ColorPicker>
      );

      const modeSelector = screen.getByTestId('mode-selector');
      expect(modeSelector).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ColorPicker>
          <ColorPicker.Mode
            className='custom-mode'
            data-testid='mode-selector'
          />
        </ColorPicker>
      );

      const modeSelector = screen.getByTestId('mode-selector');
      expect(modeSelector).toHaveClass('custom-mode');
    });

    it('shows default mode value', () => {
      render(
        <ColorPicker>
          <ColorPicker.Mode data-testid='mode-selector' />
        </ColorPicker>
      );

      const modeSelector = screen.getByTestId('mode-selector');
      expect(modeSelector).toHaveTextContent('HEX');
    });

    it('accepts custom options', () => {
      const customOptions: Array<'hex' | 'rgb'> = ['hex', 'rgb'];

      render(
        <ColorPicker>
          <ColorPicker.Mode
            options={customOptions}
            data-testid='mode-selector'
          />
        </ColorPicker>
      );

      const modeSelector = screen.getByTestId('mode-selector');
      expect(modeSelector).toBeInTheDocument();
    });
  });

  describe('Component Composition', () => {
    it('supports complete component composition', () => {
      render(
        <ColorPicker>
          <ColorPicker.Area data-testid='area' />
          <ColorPicker.Hue data-testid='hue' />
          <ColorPicker.Alpha data-testid='alpha' />
          <ColorPicker.Input data-testid='input' />
          <ColorPicker.Mode data-testid='mode' />
        </ColorPicker>
      );

      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByTestId('hue')).toBeInTheDocument();
      expect(screen.getByTestId('alpha')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('mode')).toBeInTheDocument();
    });

    it('works with different color values', () => {
      render(
        <ColorPicker value='#00ff00'>
          <ColorPicker.Area data-testid='area' />
          <ColorPicker.Hue data-testid='hue' />
          <ColorPicker.Alpha data-testid='alpha' />
          <ColorPicker.Input data-testid='input' />
          <ColorPicker.Mode data-testid='mode' />
        </ColorPicker>
      );

      // All components should render without errors
      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByTestId('hue')).toBeInTheDocument();
      expect(screen.getByTestId('alpha')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('mode')).toBeInTheDocument();
    });

    it('works with different modes', () => {
      render(
        <ColorPicker mode='rgb'>
          <ColorPicker.Area data-testid='area' />
          <ColorPicker.Hue data-testid='hue' />
          <ColorPicker.Alpha data-testid='alpha' />
          <ColorPicker.Input data-testid='input' />
          <ColorPicker.Mode data-testid='mode' />
        </ColorPicker>
      );

      // All components should render without errors
      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByTestId('hue')).toBeInTheDocument();
      expect(screen.getByTestId('alpha')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('mode')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('renders components with event handlers', () => {
      const onValueChange = vi.fn();
      const onModeChange = vi.fn();

      render(
        <ColorPicker onValueChange={onValueChange} onModeChange={onModeChange}>
          <ColorPicker.Hue data-testid='hue-slider' />
          <ColorPicker.Mode data-testid='mode-selector' />
        </ColorPicker>
      );

      const hueSlider = screen.getByTestId('hue-slider');
      const modeSelector = screen.getByTestId('mode-selector');

      expect(hueSlider).toBeInTheDocument();
      expect(modeSelector).toBeInTheDocument();
    });

    it('renders components without event handlers', () => {
      render(
        <ColorPicker>
          <ColorPicker.Hue data-testid='hue-slider' />
          <ColorPicker.Mode data-testid='mode-selector' />
        </ColorPicker>
      );

      const hueSlider = screen.getByTestId('hue-slider');
      const modeSelector = screen.getByTestId('mode-selector');

      expect(hueSlider).toBeInTheDocument();
      expect(modeSelector).toBeInTheDocument();
    });
  });
});
