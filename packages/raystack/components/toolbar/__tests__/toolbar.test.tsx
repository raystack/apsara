import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar } from '../toolbar';
import styles from '../toolbar.module.css';

describe('Toolbar', () => {
  it('renders with children', () => {
    render(
      <Toolbar>
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar>
    );
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
  });

  it('applies custom className to root', () => {
    render(<Toolbar className='custom'>content</Toolbar>);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar.className).toContain(styles.root);
    expect(toolbar.className).toContain('custom');
  });

  it('forwards ref to root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Toolbar ref={ref}>content</Toolbar>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('toolbar'));
  });

  describe('Button', () => {
    it('renders as a button', () => {
      render(
        <Toolbar>
          <Toolbar.Button>Click</Toolbar.Button>
        </Toolbar>
      );
      expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const onClick = vi.fn();
      render(
        <Toolbar>
          <Toolbar.Button onClick={onClick}>Click</Toolbar.Button>
        </Toolbar>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
      render(
        <Toolbar>
          <Toolbar.Button className='custom'>Click</Toolbar.Button>
        </Toolbar>
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain(styles.button);
      expect(button.className).toContain('custom');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Toolbar>
          <Toolbar.Button ref={ref}>Click</Toolbar.Button>
        </Toolbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Group', () => {
    it('renders children in a group', () => {
      render(
        <Toolbar>
          <Toolbar.Group data-testid='group'>
            <Toolbar.Button>A</Toolbar.Button>
            <Toolbar.Button>B</Toolbar.Button>
          </Toolbar.Group>
        </Toolbar>
      );
      const group = screen.getByTestId('group');
      expect(group.className).toContain(styles.group);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Toolbar>
          <Toolbar.Group ref={ref} data-testid='group'>
            <Toolbar.Button>A</Toolbar.Button>
          </Toolbar.Group>
        </Toolbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Separator', () => {
    it('renders a separator', () => {
      render(
        <Toolbar>
          <Toolbar.Separator data-testid='sep' />
        </Toolbar>
      );
      const sep = screen.getByTestId('sep');
      expect(sep).toBeInTheDocument();
      expect(sep.className).toContain(styles.separator);
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Toolbar>
          <Toolbar.Separator ref={ref} data-testid='sep' />
        </Toolbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Link', () => {
    it('renders a link', () => {
      render(
        <Toolbar>
          <Toolbar.Link href='https://example.com'>Example</Toolbar.Link>
        </Toolbar>
      );
      const link = screen.getByRole('link', { name: 'Example' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Toolbar>
          <Toolbar.Link ref={ref} href='#'>
            Link
          </Toolbar.Link>
        </Toolbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('Input', () => {
    it('renders an input', () => {
      render(
        <Toolbar>
          <Toolbar.Input data-testid='input' />
        </Toolbar>
      );
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <Toolbar>
          <Toolbar.Input ref={ref} data-testid='input' />
        </Toolbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Keyboard navigation', () => {
    it('navigates between buttons with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar>
          <Toolbar.Button>First</Toolbar.Button>
          <Toolbar.Button>Second</Toolbar.Button>
          <Toolbar.Button>Third</Toolbar.Button>
        </Toolbar>
      );

      const first = screen.getByText('First');
      first.focus();
      expect(first).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByText('Second')).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByText('Third')).toHaveFocus();
    });
  });
});
