import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Meter } from '../meter';
import styles from '../meter.module.css';

describe('Meter', () => {
  describe('Basic Rendering', () => {
    it('renders meter element', () => {
      const { container } = render(<Meter value={50} />);
      const meter = container.querySelector(`.${styles.meter}`);
      expect(meter).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Meter ref={ref} value={50} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Meter className='custom-meter' value={50} />
      );
      const meter = container.querySelector(`.${styles.meter}`);
      expect(meter).toHaveClass('custom-meter');
    });

    it('renders track and indicator by default', () => {
      const { container } = render(<Meter value={50} />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.indicator}`)
      ).toBeInTheDocument();
    });

    it('renders default track when no children provided', () => {
      const { container } = render(<Meter value={40} />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('defaults to linear variant', () => {
      const { container } = render(<Meter value={50} />);
      const meter = container.querySelector(`.${styles.meter}`);
      expect(meter).not.toHaveClass(styles['meter-variant-circular']);
    });

    it('renders circular variant', () => {
      const { container } = render(<Meter variant='circular' value={70} />);
      const meter = container.querySelector(`.${styles.meter}`);
      expect(meter).toHaveClass(styles['meter-variant-circular']);
    });

    it('renders SVG track and indicator for circular variant', () => {
      const { container } = render(<Meter variant='circular' value={70} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.circularTrackCircle}`)
      ).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.circularIndicatorCircle}`)
      ).toBeInTheDocument();
    });
  });

  describe('Sub-components', () => {
    it('renders Label sub-component', () => {
      render(
        <Meter value={50}>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Track />
        </Meter>
      );
      expect(screen.getByText('Storage')).toBeInTheDocument();
    });

    it('renders Value sub-component', () => {
      render(
        <Meter value={50}>
          <Meter.Value />
          <Meter.Track />
        </Meter>
      );
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders custom children instead of default track', () => {
      const { container } = render(
        <Meter value={50}>
          <Meter.Label>Custom</Meter.Label>
          <Meter.Track />
        </Meter>
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has meter role', () => {
      render(<Meter value={50} aria-label='Storage' />);
      expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('sets aria-valuenow', () => {
      render(<Meter value={75} aria-label='Storage' />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '75');
    });

    it('sets aria-valuemin and aria-valuemax', () => {
      render(<Meter value={50} min={0} max={200} aria-label='Storage' />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemin', '0');
      expect(meter).toHaveAttribute('aria-valuemax', '200');
    });
  });
});
