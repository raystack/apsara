import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Progress } from '../progress';
import styles from '../progress.module.css';

describe('Progress', () => {
  describe('Basic Rendering', () => {
    it('renders progress element', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.querySelector(`.${styles.progress}`);
      expect(progress).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Progress ref={ref} value={50} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Progress className='custom-progress' value={50} />
      );
      const progress = container.querySelector(`.${styles.progress}`);
      expect(progress).toHaveClass('custom-progress');
    });

    it('renders track and indicator by default', () => {
      const { container } = render(<Progress value={50} />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.indicator}`)
      ).toBeInTheDocument();
    });

    it('renders default track when no children provided', () => {
      const { container } = render(<Progress value={40} />);
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('defaults to linear variant', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.querySelector(`.${styles.progress}`);
      expect(progress).not.toHaveClass(styles['progress-variant-circular']);
    });

    it('renders circular variant', () => {
      const { container } = render(<Progress variant='circular' value={70} />);
      const progress = container.querySelector(`.${styles.progress}`);
      expect(progress).toHaveClass(styles['progress-variant-circular']);
    });

    it('renders SVG track and indicator for circular variant', () => {
      const { container } = render(<Progress variant='circular' value={70} />);
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
        <Progress value={50}>
          <Progress.Label>Loading</Progress.Label>
          <Progress.Track />
        </Progress>
      );
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders Value sub-component', () => {
      render(
        <Progress value={50}>
          <Progress.Value />
          <Progress.Track />
        </Progress>
      );
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders custom children instead of default track', () => {
      const { container } = render(
        <Progress value={50}>
          <Progress.Label>Custom</Progress.Label>
          <Progress.Track />
        </Progress>
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(container.querySelector(`.${styles.track}`)).toBeInTheDocument();
    });
  });

  describe('Indeterminate', () => {
    it('supports null value for indeterminate state', () => {
      render(<Progress value={null} aria-label='Loading' />);
      const progress = screen.getByRole('progressbar');
      expect(progress).not.toHaveAttribute('aria-valuenow');
    });
  });

  describe('Accessibility', () => {
    it('has progressbar role', () => {
      render(<Progress value={50} aria-label='Loading' />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('sets aria-valuenow', () => {
      render(<Progress value={75} aria-label='Loading' />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    it('sets aria-valuemin and aria-valuemax', () => {
      render(<Progress value={50} min={0} max={200} aria-label='Loading' />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '200');
    });
  });
});
