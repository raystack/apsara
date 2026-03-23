import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../field';
import styles from '../field.module.css';

describe('Field', () => {
  describe('Basic Rendering', () => {
    it('renders a div element', () => {
      const { container } = render(<Field>content</Field>);
      const field = container.firstElementChild;
      expect(field).toBeInTheDocument();
      expect(field?.tagName).toBe('DIV');
    });

    it('applies field class', () => {
      const { container } = render(<Field>content</Field>);
      const field = container.firstElementChild;
      expect(field).toHaveClass(styles.field);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Field className='custom-field'>content</Field>
      );
      const field = container.firstElementChild;
      expect(field).toHaveClass('custom-field');
      expect(field).toHaveClass(styles.field);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Field ref={ref}>content</Field>);
      expect(ref).toHaveBeenCalled();
    });

    it('defaults to 100% width', () => {
      const { container } = render(<Field>content</Field>);
      const field = container.firstElementChild;
      expect(field).toHaveStyle({ width: '100%' });
    });

    it('accepts custom width', () => {
      const { container } = render(<Field width='300px'>content</Field>);
      const field = container.firstElementChild;
      expect(field).toHaveStyle({ width: '300px' });
    });

    it('accepts numeric width', () => {
      const { container } = render(<Field width={400}>content</Field>);
      const field = container.firstElementChild;
      expect(field).toHaveStyle({ width: '400px' });
    });
  });

  describe('Simple API - Label', () => {
    it('renders label text', () => {
      render(<Field label='Email'>content</Field>);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders label as a label element', () => {
      render(<Field label='Email'>content</Field>);
      const label = screen.getByText('Email');
      expect(label.tagName).toBe('LABEL');
    });

    it('does not render label when not provided', () => {
      const { container } = render(<Field>content</Field>);
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('renders required indicator', () => {
      render(
        <Field label='Email' required>
          content
        </Field>
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders optional indicator', () => {
      render(
        <Field label='Email' optional>
          content
        </Field>
      );
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });
  });

  describe('Simple API - Helper Text', () => {
    it('renders helper text', () => {
      render(<Field helperText='Enter a valid email'>content</Field>);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('does not render helper text when error is present', () => {
      render(
        <Field helperText='Enter email' error='Invalid email'>
          content
        </Field>
      );
      expect(screen.queryByText('Enter email')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Simple API - Error', () => {
    it('renders error message', () => {
      render(<Field error='Required field'>content</Field>);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('applies error styles', () => {
      render(<Field error='Required'>content</Field>);
      const error = screen.getByText('Required');
      expect(error).toHaveClass(styles.error);
    });

    it('sets invalid state when error is provided', () => {
      const { container } = render(<Field error='Error'>content</Field>);
      const field = container.firstElementChild;
      expect(field).toHaveAttribute('data-invalid', '');
    });
  });

  describe('Sub-component API', () => {
    it('renders Field.Label', () => {
      render(
        <Field>
          <Field.Label>Username</Field.Label>
        </Field>
      );
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders Field.Description', () => {
      render(
        <Field>
          <Field.Description>Help text</Field.Description>
        </Field>
      );
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });

    it('renders Field.Error', () => {
      render(
        <Field invalid>
          <Field.Error match>Error message</Field.Error>
        </Field>
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders Field.Control', () => {
      render(
        <Field>
          <Field.Control placeholder='Type here' />
        </Field>
      );
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('applies custom className to sub-components', () => {
      render(
        <Field>
          <Field.Label className='custom-label'>Label</Field.Label>
          <Field.Description className='custom-desc'>Desc</Field.Description>
        </Field>
      );
      expect(screen.getByText('Label')).toHaveClass('custom-label');
      expect(screen.getByText('Desc')).toHaveClass('custom-desc');
    });
  });

  describe('Children rendering', () => {
    it('renders children inside control wrapper', () => {
      render(
        <Field label='Name'>
          <input data-testid='child-input' />
        </Field>
      );
      expect(screen.getByTestId('child-input')).toBeInTheDocument();
    });
  });
});
