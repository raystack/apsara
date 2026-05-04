import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from '../label';
import styles from '../label.module.css';

describe('Label', () => {
  describe('Basic Rendering', () => {
    it('renders as label element by default', () => {
      render(<Label>Field Label</Label>);
      expect(screen.getByText('Field Label').tagName).toBe('LABEL');
    });

    it('renders children text', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('applies base label class', () => {
      render(<Label>Label</Label>);
      expect(screen.getByText('Label')).toHaveClass(styles.label);
    });

    it('applies custom className', () => {
      render(<Label className='custom-label'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');
      expect(label).toHaveClass(styles.label);
    });
  });

  describe('Optional Indicator', () => {
    it('shows optional indicator when required={false}', () => {
      render(<Label required={false}>Field</Label>);
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('does not show optional indicator when required={true}', () => {
      render(<Label required>Field</Label>);
      expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    });

    it('does not show optional indicator when required is unset', () => {
      render(<Label>Field</Label>);
      expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('supports htmlFor attribute', () => {
      render(<Label htmlFor='username-input'>Username</Label>);
      expect(screen.getByText('Username')).toHaveAttribute(
        'for',
        'username-input'
      );
    });

    it('supports id attribute', () => {
      render(<Label id='form-label'>Label</Label>);
      expect(screen.getByText('Label')).toHaveAttribute('id', 'form-label');
    });

    it('supports data attributes', () => {
      render(<Label data-testid='test-label'>Label</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });

  describe('Polymorphism via render', () => {
    it('renders a custom element when render is provided', () => {
      render(<Label render={<span />}>Label</Label>);
      expect(screen.getByText('Label').tagName).toBe('SPAN');
    });
  });
});
