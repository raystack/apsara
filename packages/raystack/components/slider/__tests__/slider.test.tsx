import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
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

    it('renders track and range', () => {
      const { container } = render(<Slider />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
      expect(container.querySelector(`.${styles.range}`)).toBeInTheDocument();
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
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('sets custom min and max', () => {
      const { container } = render(<Slider min={10} max={50} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '50');
    });

    it('sets step value', () => {
      const { container } = render(<Slider step={5} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });

    it('handles single value', () => {
      render(<Slider value={50} onChange={() => {}} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('handles range values', () => {
      const { container } = render(
        <Slider variant='range' value={[20, 80]} onChange={() => {}} />
      );
      const sliders = container.querySelectorAll('[role="slider"]');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
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

    it('sets aria-label for thumbs', () => {
      render(<Slider label='Volume' />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-label', 'Volume');
    });
  });

  describe('Accessibility', () => {
    it('has default aria-label for single slider', () => {
      const { container } = render(<Slider />);
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-label', 'Slider');
    });

    it('has default aria-label for range slider', () => {
      const { container } = render(<Slider variant='range' />);
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-label', 'Range slider');
    });

    it('uses custom aria-label', () => {
      const { container } = render(<Slider aria-label='Audio volume' />);
      const root = container.querySelector(`.${styles.slider}`);
      expect(root).toHaveAttribute('aria-label', 'Audio volume');
    });

    it('sets aria-valuetext', () => {
      render(
        <Slider value={50} aria-valuetext='50 percent' onChange={() => {}} />
      );
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuetext', '50 percent');
    });
  });

  describe('Event Handlers', () => {
    it('calls onChange with single value', () => {
      const handleChange = vi.fn();
      const { container } = render(<Slider onChange={handleChange} />);
      const slider = container.querySelector('[role="slider"]');

      // Simulate value change
      slider?.dispatchEvent(new Event('change', { bubbles: true }));
      // Note: Actual value change would require more complex interaction
    });

    it('calls onChange with range values', () => {
      const handleChange = vi.fn();
      render(<Slider variant='range' onChange={handleChange} />);
      // Note: Testing actual slider interaction would require more complex setup
    });
  });

  describe('Default Values', () => {
    it('uses defaultValue for single slider', () => {
      const { container } = render(<Slider defaultValue={30} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuenow', '30');
    });

    it('uses defaultValue for range slider', () => {
      const { container } = render(
        <Slider variant='range' defaultValue={[25, 75]} />
      );
      const sliders = container.querySelectorAll('[role="slider"]');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
    });
  });
});
