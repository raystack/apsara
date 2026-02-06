import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '../slider';
import styles from '../slider.module.css';

describe('Slider', () => {
  describe('Basic Rendering', () => {
    it('renders slider element', () => {
      const { container } = render(<Slider />);
      const slider = container.querySelector(`.${styles.slider}`);
      expect(slider).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Slider ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(<Slider className='custom-slider' />);
      const slider = container.querySelector(`.${styles.slider}`);
      expect(slider).toHaveClass('custom-slider');
    });

    it('renders track and indicator', () => {
      const { container } = render(<Slider />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.indicator}`)
      ).toBeInTheDocument();
    });

    it('renders thumb', () => {
      const { container } = render(<Slider />);
      expect(container.querySelector(`.${styles.thumb}`)).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('defaults to single variant', () => {
      const { container } = render(<Slider />);
      const slider = container.querySelector(`.${styles.slider}`);
      expect(slider).toHaveClass(styles['slider-variant-single']);
    });

    it('renders range variant with two thumbs', () => {
      const { container } = render(<Slider variant='range' />);
      const slider = container.querySelector(`.${styles.slider}`);
      const thumbs = container.querySelectorAll(`.${styles.thumb}`);
      expect(slider).toHaveClass(styles['slider-variant-range']);
      expect(thumbs).toHaveLength(2);
    });
  });

  describe('Values', () => {
    it('uses default min and max values', () => {
      const { container } = render(<Slider />);
      const input = container.querySelector('input[type="range"]');
      // Base UI sets min/max on the input element
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('sets custom min and max', () => {
      const { container } = render(<Slider min={10} max={50} />);
      const input = container.querySelector('input[type="range"]');
      expect(input).toHaveAttribute('min', '10');
      expect(input).toHaveAttribute('max', '50');
    });

    it('sets step value', () => {
      const { container } = render(<Slider step={5} />);
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toBeInTheDocument();
    });

    it('handles single value', async () => {
      render(<Slider value={50} />);
      await waitFor(() => {
        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('aria-valuenow', '50');
      });
    });

    it('handles range values', async () => {
      const { container } = render(<Slider variant='range' value={[20, 80]} />);
      await waitFor(() => {
        const sliders = container.querySelectorAll('input[type="range"]');
        expect(sliders.length).toBeGreaterThanOrEqual(2);
        expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
        expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
      });
    });
  });

  describe('Labels', () => {
    it('renders single label', () => {
      const { container } = render(<Slider label='Volume' />);
      expect(container.textContent).toContain('Volume');
    });

    it('renders range labels', () => {
      const { container } = render(
        <Slider variant='range' label={['Min', 'Max']} />
      );
      expect(container.textContent).toContain('Min');
      expect(container.textContent).toContain('Max');
    });

    it('sets aria-label for thumbs', async () => {
      render(<Slider label='Volume' />);
      await waitFor(() => {
        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('aria-label', 'Volume');
      });
    });
  });

  describe('Accessibility', () => {
    it('uses custom aria-label', () => {
      const { container } = render(<Slider aria-label='Audio volume' />);
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-label', 'Audio volume');
    });
  });

  describe('Event Handlers', () => {
    it('calls onValueChange with single value', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(
        <Slider onValueChange={handleChange} defaultValue={50} />
      );

      await waitFor(async () => {
        const input = container.querySelector(
          'input[type="range"]'
        ) as HTMLInputElement;
        expect(input).toBeInTheDocument();

        if (input) {
          await act(async () => {
            input.focus();
            await user.keyboard('{ArrowRight}');
          });
        }
      });

      // Give Base UI time to process the change
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      const callArgs = handleChange.mock.calls[0];
      // Base UI passes value as first arg, eventDetails as second
      expect(
        typeof callArgs[0] === 'number' || Array.isArray(callArgs[0])
      ).toBe(true);
    });

    it('calls onValueChange with range values', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(
        <Slider
          variant='range'
          onValueChange={handleChange}
          defaultValue={[40, 60]}
        />
      );

      await waitFor(async () => {
        const inputs = container.querySelectorAll('input[type="range"]');
        expect(inputs.length).toBeGreaterThanOrEqual(2);

        const lowerSlider = inputs[0] as HTMLInputElement;
        await act(async () => {
          lowerSlider.focus();
          await user.keyboard('{ArrowRight}');
        });
      });

      // Give Base UI time to process the change
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      const firstCall = handleChange.mock.calls[0];
      expect(Array.isArray(firstCall[0])).toBe(true);
    });
  });

  describe('Default Values', () => {
    it('uses defaultValue for single slider', async () => {
      const { container } = render(<Slider defaultValue={30} />);
      await waitFor(() => {
        const slider = container.querySelector('input[type="range"]');
        expect(slider).toHaveAttribute('aria-valuenow', '30');
      });
    });

    it('uses defaultValue for range slider', async () => {
      const { container } = render(
        <Slider variant='range' defaultValue={[25, 75]} />
      );
      await waitFor(() => {
        const sliders = container.querySelectorAll('input[type="range"]');
        expect(sliders.length).toBeGreaterThanOrEqual(2);
        expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
        expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
      });
    });
  });
});
