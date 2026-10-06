import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Form } from '../form';
import styles from '../form.module.css';

describe('Form', () => {
  describe('Basic Rendering', () => {
    it('renders a form element', () => {
      const { container } = render(<Form>content</Form>);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('applies form class', () => {
      const { container } = render(<Form>content</Form>);
      const form = container.querySelector('form');
      expect(form).toHaveClass(styles.form);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Form className='custom-form'>content</Form>
      );
      const form = container.querySelector('form');
      expect(form).toHaveClass('custom-form');
      expect(form).toHaveClass(styles.form);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Form ref={ref}>content</Form>);
      expect(ref).toHaveBeenCalled();
    });

    it('renders children', () => {
      render(
        <Form>
          <input data-testid='child' />
        </Form>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit handler', () => {
      const handleSubmit = vi.fn(e => e.preventDefault());
      render(
        <Form onSubmit={handleSubmit}>
          <button type='submit'>Submit</button>
        </Form>
      );
      fireEvent.click(screen.getByText('Submit'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
