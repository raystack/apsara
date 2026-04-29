import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import styles from '../field.module.css';
import { Field } from '../index';

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

    it('renders optional indicator when required={false}', () => {
      render(
        <Field label='Email' required={false}>
          content
        </Field>
      );
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('does not render optional indicator by default', () => {
      render(<Field label='Email'>content</Field>);
      expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    });
  });

  describe('Simple API - Description', () => {
    it('renders description text', () => {
      render(<Field description='Enter a valid email'>content</Field>);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('does not render description when error is present', () => {
      render(
        <Field description='Enter email' error='Invalid email'>
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

    it('renders optional indicator on Field.Label via required={false}', () => {
      render(
        <Field>
          <Field.Label required={false}>Username</Field.Label>
        </Field>
      );
      expect(screen.getByText('(optional)')).toBeInTheDocument();
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

    it('does not apply horizontal class when orientation is vertical (default)', () => {
      render(
        <Field>
          <Field.Label>Label</Field.Label>
        </Field>
      );
      expect(screen.getByText('Label')).not.toHaveClass(
        styles['label-horizontal']
      );
    });

    it('applies horizontal class when orientation="horizontal"', () => {
      render(
        <Field>
          <Field.Label orientation='horizontal'>Label</Field.Label>
        </Field>
      );
      expect(screen.getByText('Label')).toHaveClass(styles['label-horizontal']);
    });

    it('associates Field.Label with control via htmlFor when used inline', () => {
      render(
        <>
          <Field.Label orientation='horizontal' htmlFor='radio-1'>
            Option
          </Field.Label>
          <input type='radio' id='radio-1' />
        </>
      );
      expect(screen.getByLabelText('Option')).toBeInTheDocument();
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
