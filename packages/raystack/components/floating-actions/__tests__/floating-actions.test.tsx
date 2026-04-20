import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { FloatingActions } from '../floating-actions';
import styles from '../floating-actions.module.css';

describe('FloatingActions', () => {
  it('renders with children and a toolbar role', () => {
    render(
      <FloatingActions>
        <span>content</span>
      </FloatingActions>
    );
    const root = screen.getByRole('toolbar');
    expect(root).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies custom className to the root', () => {
    render(<FloatingActions className='custom'>content</FloatingActions>);
    const root = screen.getByRole('toolbar');
    expect(root.className).toContain(styles.root);
    expect(root.className).toContain('custom');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FloatingActions ref={ref}>content</FloatingActions>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('toolbar'));
  });

  it('allows overriding the root role', () => {
    render(
      <FloatingActions role='group' aria-label='bulk'>
        content
      </FloatingActions>
    );
    expect(screen.getByRole('group', { name: 'bulk' })).toBeInTheDocument();
  });

  describe('Separator', () => {
    it('renders a separator with the separator class', () => {
      render(
        <FloatingActions>
          <FloatingActions.Separator data-testid='sep' />
        </FloatingActions>
      );
      const sep = screen.getByTestId('sep');
      expect(sep).toBeInTheDocument();
      expect(sep.className).toContain(styles.separator);
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies custom className', () => {
      render(
        <FloatingActions>
          <FloatingActions.Separator data-testid='sep' className='custom-sep' />
        </FloatingActions>
      );
      const sep = screen.getByTestId('sep');
      expect(sep.className).toContain(styles.separator);
      expect(sep.className).toContain('custom-sep');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <FloatingActions>
          <FloatingActions.Separator ref={ref} data-testid='sep' />
        </FloatingActions>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('sep'));
    });
  });
});
