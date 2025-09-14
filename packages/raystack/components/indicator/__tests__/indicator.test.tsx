import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../test-utils';
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

    it('has role="status"', () => {
      render(<Indicator />);
      expect(screen.getByRole('status')).toBeInTheDocument();
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

  describe('Label', () => {
    it('renders label text when provided', () => {
      render(<Indicator label='5' />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders label with correct class', () => {
      const { container } = render(<Indicator label='99+' />);
      const label = container.querySelector(`.${styles.label}`);
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('99+');
    });

    it('sets data-length attribute on label', () => {
      const { container } = render(<Indicator label='10' />);
      const label = container.querySelector(`.${styles.label}`);
      expect(label).toHaveAttribute('data-length', '2');
    });

    it('sets data-length for single character', () => {
      const { container } = render(<Indicator label='1' />);
      const label = container.querySelector(`.${styles.label}`);
      expect(label).toHaveAttribute('data-length', '1');
    });

    it('sets data-length for long labels', () => {
      const { container } = render(<Indicator label='999+' />);
      const label = container.querySelector(`.${styles.label}`);
      expect(label).toHaveAttribute('data-length', '4');
    });
  });

  describe('Dot', () => {
    it('renders dot when no label provided', () => {
      const { container } = render(<Indicator />);
      const dot = container.querySelector(`.${styles.dot}`);
      expect(dot).toBeInTheDocument();
    });

    it('dot has aria-hidden', () => {
      const { container } = render(<Indicator />);
      const dot = container.querySelector(`.${styles.dot}`);
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not render dot when label is provided', () => {
      const { container } = render(<Indicator label='5' />);
      const dot = container.querySelector(`.${styles.dot}`);
      expect(dot).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses custom aria-label when provided', () => {
      render(<Indicator aria-label='New notifications' />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'New notifications');
    });

    it('uses label as aria-label when no custom aria-label', () => {
      render(<Indicator label='3' />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', '3');
    });

    it('generates default aria-label from variant', () => {
      render(<Indicator variant='warning' />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'warning indicator');
    });

    it('prioritizes aria-label over label', () => {
      render(<Indicator label='5' aria-label='Five new items' />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'Five new items');
    });
  });

  describe('HTML Attributes', () => {
    it('supports data attributes on wrapper', () => {
      render(<Indicator data-testid='test-indicator' />);
      expect(screen.getByTestId('test-indicator')).toBeInTheDocument();
    });

    it('supports id attribute', () => {
      const { container } = render(<Indicator id='notification-indicator' />);
      const wrapper = container.querySelector(`.${styles.wrapper}`);
      expect(wrapper).toHaveAttribute('id', 'notification-indicator');
    });

    it('supports style attribute', () => {
      const { container } = render(
        <Indicator style={{ position: 'relative' }} />
      );
      const wrapper = container.querySelector(`.${styles.wrapper}`);
      expect(wrapper).toHaveStyle({ position: 'relative' });
    });
  });

  describe('With Children', () => {
    it('renders complex children', () => {
      render(
        <Indicator label='2'>
          <div data-testid='complex'>
            <span>Icon</span>
            <span>Text</span>
          </div>
        </Indicator>
      );
      expect(screen.getByTestId('complex')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('positions indicator relative to children', () => {
      render(
        <Indicator>
          <button>Button with indicator</button>
        </Indicator>
      );
      const button = screen.getByRole('button');
      const indicator = screen.getByRole('status');
      expect(button.parentElement).toContainElement(indicator);
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      render(
        <Indicator
          variant='success'
          label='10'
          className='custom'
          aria-label='10 completed items'
        >
          <button>Tasks</button>
        </Indicator>
      );

      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass(styles['indicator-variant-success']);
      expect(indicator).toHaveClass('custom');
      expect(indicator).toHaveAttribute('aria-label', '10 completed items');
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tasks' })).toBeInTheDocument();
    });

    it('renders different variants with labels', () => {
      const { rerender } = render(<Indicator variant='danger' label='!' />);
      expect(screen.getByText('!')).toBeInTheDocument();

      rerender(<Indicator variant='warning' label='3' />);
      expect(screen.getByText('3')).toBeInTheDocument();

      rerender(<Indicator variant='success' />);
      const { container } = render(<Indicator variant='success' />);
      expect(container.querySelector(`.${styles.dot}`)).toBeInTheDocument();
    });
  });
});
