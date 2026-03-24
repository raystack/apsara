import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from '../number-field';
import styles from '../number-field.module.css';

describe('NumberField', () => {
  describe('Basic Rendering', () => {
    it('renders default structure when no children provided', () => {
      render(<NumberField defaultValue={5} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('5');
    });

    it('renders decrement and increment buttons', () => {
      render(<NumberField defaultValue={0} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('applies custom className to root', () => {
      const { container } = render(
        <NumberField className='custom-class' defaultValue={0} />
      );
      const root = container.firstElementChild;
      expect(root).toHaveClass(styles.root);
      expect(root).toHaveClass('custom-class');
    });

    it('forwards ref to root', () => {
      const ref = createRef<HTMLDivElement>();
      render(<NumberField ref={ref} defaultValue={0} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Composed Usage', () => {
    it('renders children when provided', () => {
      render(
        <NumberField defaultValue={0}>
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField>
      );
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  describe('Interaction', () => {
    it('increments value on increment button click', () => {
      const onValueChange = vi.fn();
      render(<NumberField defaultValue={5} onValueChange={onValueChange} />);
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[1]);
      expect(onValueChange).toHaveBeenCalled();
    });

    it('decrements value on decrement button click', () => {
      const onValueChange = vi.fn();
      render(<NumberField defaultValue={5} onValueChange={onValueChange} />);
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      expect(onValueChange).toHaveBeenCalled();
    });

    it('supports keyboard input', async () => {
      const user = userEvent.setup();
      render(<NumberField defaultValue={0} />);
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '42');
      expect(input).toHaveValue('42');
    });
  });

  describe('Controlled', () => {
    it('renders controlled value', () => {
      render(<NumberField value={10} />);
      expect(screen.getByRole('textbox')).toHaveValue('10');
    });
  });

  describe('Constraints', () => {
    it('respects min and max', () => {
      render(<NumberField defaultValue={10} min={0} max={10} />);
      const buttons = screen.getAllByRole('button');
      const input = screen.getByRole('textbox');
      // Try to increment beyond max
      fireEvent.click(buttons[1]);
      expect(input).toHaveValue('10');
    });
  });

  describe('Disabled State', () => {
    it('disables all controls when disabled', () => {
      render(<NumberField defaultValue={0} disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('disabled');
    });
  });

  describe('Sub-components', () => {
    it('Group applies custom className', () => {
      render(
        <NumberField defaultValue={0}>
          <NumberField.Group className='custom-group'>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField>
      );
      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-group');
      expect(group).toHaveClass(styles.group);
    });

    it('Input applies custom className', () => {
      render(
        <NumberField defaultValue={0}>
          <NumberField.Group>
            <NumberField.Input className='custom-input' />
          </NumberField.Group>
        </NumberField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass(styles.input);
    });

    it('Decrement forwards ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <NumberField defaultValue={0}>
          <NumberField.Group>
            <NumberField.Decrement ref={ref} />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('Increment forwards ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <NumberField defaultValue={0}>
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment ref={ref} />
          </NumberField.Group>
        </NumberField>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('ScrubArea', () => {
    it('renders label inside scrub area', () => {
      render(
        <NumberField defaultValue={0}>
          <NumberField.ScrubArea label='Amount' />
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField>
      );
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });
  });
});
