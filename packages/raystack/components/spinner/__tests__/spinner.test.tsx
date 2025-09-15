import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../button';
import { Spinner } from '../spinner';
import styles from '../spinner.module.css';

describe('Spinner', () => {
  it('renders correctly with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    const poles = spinner.querySelectorAll(`.${styles.pole}`);

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(styles['spinner-size-1']);
    expect(spinner).toHaveClass(styles['spinner-color-neutral']); // Default is neutral
    expect(poles).toHaveLength(8);
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders with size %i', size => {
    render(<Spinner size={size} />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(styles[`spinner-size-${size}`]);
  });

  it('renders with neutral color', () => {
    render(<Spinner color='neutral' />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(styles['spinner-color-neutral']);
  });

  it('accepts custom className', () => {
    const customClass = 'my-custom-class';
    render(<Spinner className={customClass} />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(customClass);
    expect(spinner).toHaveClass(styles.spinner);
  });

  it('verifies animation properties', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    const pole = spinner.querySelector(`.${styles.pole}`);

    expect(pole).toBeInTheDocument();
    expect(pole).toHaveClass(styles.pole);
  });

  it('has correct accessibility attributes', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders properly inside a button', () => {
    render(
      <Button>
        Loading <Spinner />
      </Button>
    );

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner.closest('button')).toBeInTheDocument();
  });

  it('maintains container boundaries', () => {
    const { container } = render(
      <div style={{ width: '100px', height: '100px' }}>
        <Spinner size={6} />
      </div>
    );

    const spinner = screen.getByRole('status', { hidden: true });
    const spinnerRect = spinner.getBoundingClientRect();
    const containerRect = (
      container.firstChild as HTMLElement
    ).getBoundingClientRect();

    expect(spinnerRect.width).toBeLessThanOrEqual(containerRect.width);
    expect(spinnerRect.height).toBeLessThanOrEqual(containerRect.height);
  });
});
