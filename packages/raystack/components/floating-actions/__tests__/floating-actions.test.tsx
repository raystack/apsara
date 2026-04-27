import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import styles from '../floating-actions.module.css';
import { FloatingActions } from '../index';

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

  it('defaults to the floating variant anchored bottom-center', () => {
    render(<FloatingActions>content</FloatingActions>);
    const root = screen.getByRole('toolbar');
    expect(root).toHaveAttribute('data-variant', 'floating');
    expect(root).toHaveAttribute('data-side', 'bottom');
    expect(root).toHaveAttribute('data-align', 'center');
  });

  it('renders the inline variant without floating positioning attributes', () => {
    render(<FloatingActions variant='inline'>content</FloatingActions>);
    const root = screen.getByRole('toolbar');
    expect(root).toHaveAttribute('data-variant', 'inline');
  });

  it('reflects side and align on the root for floating variant', () => {
    render(
      <FloatingActions side='top' align='end'>
        content
      </FloatingActions>
    );
    const root = screen.getByRole('toolbar');
    expect(root).toHaveAttribute('data-side', 'top');
    expect(root).toHaveAttribute('data-align', 'end');
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

  describe('Group', () => {
    it('renders a Toolbar.Group inside the root', () => {
      render(
        <FloatingActions>
          <FloatingActions.Group data-testid='group'>
            <button type='button'>action</button>
          </FloatingActions.Group>
        </FloatingActions>
      );
      const group = screen.getByTestId('group');
      expect(group).toBeInTheDocument();
      expect(group.className).toContain(styles.group);
    });
  });

  describe('Separator', () => {
    it('renders a vertical separator with role="separator"', () => {
      render(
        <FloatingActions>
          <FloatingActions.Separator data-testid='sep' />
        </FloatingActions>
      );
      const sep = screen.getByTestId('sep');
      expect(sep).toBeInTheDocument();
      expect(sep).toHaveAttribute('role', 'separator');
      expect(sep).toHaveAttribute('data-orientation', 'vertical');
      expect(sep.className).toContain(styles.separator);
    });

    it('passes through Separator props (color, className)', () => {
      render(
        <FloatingActions>
          <FloatingActions.Separator
            data-testid='sep'
            color='secondary'
            className='custom-sep'
          />
        </FloatingActions>
      );
      const sep = screen.getByTestId('sep');
      expect(sep.className).toContain('custom-sep');
    });
  });
});
