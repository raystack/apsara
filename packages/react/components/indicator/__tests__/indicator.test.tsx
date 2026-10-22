import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Indicator } from '../indicator';
import styles from '../indicator.module.css';

describe('Indicator', () => {
  describe('Basic Rendering', () => {
    it('renders wrapper and indicator', () => {
      const { container } = render(<Indicator />);
      expect(container.querySelector(`.${styles.wrapper}`)).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.indicator}`)
      ).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <Indicator>
          <button>Click me</button>
        </Indicator>
      );
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument();
    });

    it('applies custom className to indicator', () => {
      const { container } = render(<Indicator className='custom-indicator' />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toHaveClass('custom-indicator');
    });
  });

  describe('Variants', () => {
    const variants = [
      'accent',
      'warning',
      'danger',
      'success',
      'neutral'
    ] as const;

    it.each(variants)('renders %s variant correctly', variant => {
      const { container } = render(<Indicator variant={variant} />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toHaveClass(styles[`indicator-variant-${variant}`]);
    });

    it('defaults to accent variant', () => {
      const { container } = render(<Indicator />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toHaveClass(styles['indicator-variant-accent']);
    });
  });

  describe('Indicator', () => {
    it('renders label text when provided', () => {
      render(<Indicator label='5' />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
    it('renders dot when no label provided', () => {
      const { container } = render(<Indicator />);
      const dot = container.querySelector(`.${styles.dot}`);
      expect(dot).toBeInTheDocument();
    });
  });
});
