import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Kbd } from '../kbd';
import styles from '../kbd.module.css';

describe('Kbd', () => {
  describe('Basic Rendering', () => {
    it('renders its children', () => {
      render(<Kbd>Ctrl</Kbd>);
      expect(screen.getByText('Ctrl')).toBeInTheDocument();
    });

    it('renders a kbd element', () => {
      render(<Kbd>Ctrl</Kbd>);
      expect(screen.getByText('Ctrl').tagName).toBe('KBD');
    });

    it('applies the base class', () => {
      render(<Kbd>Ctrl</Kbd>);
      expect(screen.getByText('Ctrl')).toHaveClass(styles.kbd);
    });

    it('merges a custom className with the base class', () => {
      render(<Kbd className='custom'>Ctrl</Kbd>);
      const kbd = screen.getByText('Ctrl');
      expect(kbd).toHaveClass(styles.kbd);
      expect(kbd).toHaveClass('custom');
    });

    it('forwards arbitrary props to the element', () => {
      render(<Kbd aria-label='Control key'>Ctrl</Kbd>);
      expect(screen.getByText('Ctrl')).toHaveAttribute(
        'aria-label',
        'Control key'
      );
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(<Kbd ref={ref}>Ctrl</Kbd>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('KBD');
    });
  });

  describe('Variants', () => {
    it('applies the solid variant by default', () => {
      render(<Kbd>Ctrl</Kbd>);
      expect(screen.getByText('Ctrl')).toHaveClass(styles['kbd-solid']);
    });

    it('applies the ghost variant when requested', () => {
      render(<Kbd variant='ghost'>Ctrl</Kbd>);
      const kbd = screen.getByText('Ctrl');
      expect(kbd).toHaveClass(styles['kbd-ghost']);
      expect(kbd).not.toHaveClass(styles['kbd-solid']);
    });

    it('inherits the variant from a parent group', () => {
      render(
        <Kbd.Group variant='ghost'>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(screen.getByText('⌘')).toHaveClass(styles['kbd-ghost']);
      expect(screen.getByText('K')).toHaveClass(styles['kbd-ghost']);
    });

    it('lets a key override the variant inherited from its group', () => {
      render(
        <Kbd.Group variant='ghost'>
          <Kbd variant='solid'>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(screen.getByText('⌘')).toHaveClass(styles['kbd-solid']);
      expect(screen.getByText('K')).toHaveClass(styles['kbd-ghost']);
    });

    it('falls back to solid for keys in a group with no variant', () => {
      render(
        <Kbd.Group>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(screen.getByText('K')).toHaveClass(styles['kbd-solid']);
    });

    it('does not put a key variant class on the group', () => {
      const { container } = render(
        <Kbd.Group variant='ghost'>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      const group = container.querySelector(`.${styles['kbd-group']}`);
      expect(group).not.toHaveClass(styles['kbd-ghost']);
    });
  });

  describe('Kbd.Group', () => {
    it('renders every key it contains', () => {
      render(
        <Kbd.Group>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(screen.getByText('⌘')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('renders a kbd element so nested keys stay semantic', () => {
      const { container } = render(
        <Kbd.Group>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      const group = container.querySelector(`.${styles['kbd-group']}`);
      expect(group?.tagName).toBe('KBD');
    });

    it('applies the group class, not the key class', () => {
      const { container } = render(
        <Kbd.Group>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      const group = container.querySelector(`.${styles['kbd-group']}`);
      expect(group).not.toHaveClass(styles.kbd);
    });

    it('merges a custom className with the group class', () => {
      const { container } = render(
        <Kbd.Group className='custom'>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      const group = container.querySelector(`.${styles['kbd-group']}`);
      expect(group).toHaveClass('custom');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Kbd.Group ref={ref}>
          <Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(ref.current?.tagName).toBe('KBD');
    });

    it('allows plain text separators between keys', () => {
      render(
        <Kbd.Group>
          <Kbd>⌘</Kbd>+<Kbd>K</Kbd>
        </Kbd.Group>
      );
      expect(screen.getByText('+')).toBeInTheDocument();
    });
  });

  describe('Composition', () => {
    it('exposes Group off the root', () => {
      expect(Kbd.Group).toBeDefined();
    });

    it('sets displayName on both parts', () => {
      expect(Kbd.displayName).toBe('Kbd');
      expect(Kbd.Group.displayName).toBe('Kbd.Group');
    });
  });
});
