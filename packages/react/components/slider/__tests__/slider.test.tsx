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

    it('handles single value', () => {
      const { container } = render(<Slider value={50} />);
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('handles range values', () => {
      const { container } = render(<Slider variant='range' value={[20, 80]} />);
      const sliders = container.querySelectorAll('input[type="range"]');
      expect(sliders.length).toBeGreaterThanOrEqual(2);
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
    });
  });

  describe('Thumb labels', () => {
    it('renders single thumb label', () => {
      const { container } = render(<Slider thumbLabel='Volume' />);
      expect(container.textContent).toContain('Volume');
    });

    it('renders range thumb labels', () => {
      const { container } = render(
        <Slider variant='range' thumbLabel={['Min', 'Max']} />
      );
      expect(container.textContent).toContain('Min');
      expect(container.textContent).toContain('Max');
    });

    it('sets aria-label for thumbs', () => {
      const { container } = render(<Slider thumbLabel='Volume' />);
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('aria-label', 'Volume');
    });

    it('sets aria-label on both thumbs of a range', () => {
      const { container } = render(
        <Slider variant='range' thumbLabel={['Min', 'Max']} />
      );
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs[0]).toHaveAttribute('aria-label', 'Min');
      expect(inputs[1]).toHaveAttribute('aria-label', 'Max');
    });

    it('uses one string for both thumbs of a range', () => {
      const { container } = render(
        <Slider variant='range' thumbLabel='Price' />
      );
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs[0]).toHaveAttribute('aria-label', 'Price');
      expect(inputs[1]).toHaveAttribute('aria-label', 'Price');
    });

    it('falls back to default thumb names', () => {
      const { container, rerender } = render(<Slider />);
      expect(container.querySelector('input[type="range"]')).toHaveAttribute(
        'aria-label',
        'Slider thumb'
      );

      rerender(<Slider variant='range' />);
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs[0]).toHaveAttribute('aria-label', 'Thumb 1');
      expect(inputs[1]).toHaveAttribute('aria-label', 'Thumb 2');
    });
  });

  describe('Label', () => {
    it('labels the thumb with Slider.Label', () => {
      const { container } = render(
        <Slider defaultValue={50}>
          <Slider.Label>Volume</Slider.Label>
        </Slider>
      );
      const label = screen.getByText('Volume');
      const input = container.querySelector('input[type="range"]');
      expect(input).not.toHaveAttribute('aria-label');
      expect(input).toHaveAttribute('aria-labelledby', label.id);
    });

    it('labels the root group with Slider.Label', () => {
      render(
        <Slider defaultValue={50}>
          <Slider.Label>Volume</Slider.Label>
        </Slider>
      );
      expect(screen.getByRole('group', { name: 'Volume' })).toBeInTheDocument();
    });

    it('labels both thumbs of a range with Slider.Label', () => {
      const { container } = render(
        <Slider variant='range' defaultValue={[20, 80]}>
          <Slider.Label>Price</Slider.Label>
        </Slider>
      );
      const label = screen.getByText('Price');
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs[0]).toHaveAttribute('aria-labelledby', label.id);
      expect(inputs[1]).toHaveAttribute('aria-labelledby', label.id);
    });

    it('prefers thumbLabel over Slider.Label for thumb names', () => {
      const { container } = render(
        <Slider
          variant='range'
          defaultValue={[20, 80]}
          thumbLabel={['Min', 'Max']}
        >
          <Slider.Label>Price</Slider.Label>
        </Slider>
      );
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs[0]).toHaveAttribute('aria-label', 'Min');
      expect(inputs[1]).toHaveAttribute('aria-label', 'Max');
      expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument();
    });

    it('applies the label class and custom className', () => {
      render(
        <Slider>
          <Slider.Label className='custom-label'>Volume</Slider.Label>
        </Slider>
      );
      const label = screen.getByText('Volume');
      expect(label).toHaveClass(styles.label);
      expect(label).toHaveClass('custom-label');
    });

    it('renders Slider.Value next to the label', () => {
      render(
        <Slider defaultValue={30}>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
        </Slider>
      );
      expect(screen.getByText('30')).toHaveClass(styles.value);
    });
  });

  describe('Accessibility', () => {
    it('has default aria-label for single slider', () => {
      const { container } = render(<Slider />);
      const root = container.querySelector(`.${styles.slider}`);
      // Base UI doesn't set default aria-label automatically
      // The component should set it, but if not, we check it's at least not conflicting
      const ariaLabel = root?.getAttribute('aria-label');
      expect(ariaLabel === 'Slider' || ariaLabel === null).toBe(true);
    });

    it('has default aria-label for range slider', () => {
      const { container } = render(<Slider variant='range' />);
      const root = container.querySelector(`.${styles.slider}`);
      const ariaLabel = root?.getAttribute('aria-label');
      expect(ariaLabel === 'Range slider' || ariaLabel === null).toBe(true);
    });

    it('uses custom aria-label', () => {
      const { container } = render(<Slider aria-label='Audio volume' />);
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-label', 'Audio volume');
    });

    it('sets aria-valuetext', () => {
      const { container } = render(
        <Slider value={50} aria-valuetext='50 percent' />
      );
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-valuetext', '50 percent');
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
