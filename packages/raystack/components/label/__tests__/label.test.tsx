import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from '../label';
import styles from '../label.module.css';

describe('Label', () => {
  describe('Basic Rendering', () => {
    it('renders as label element', () => {
      render(<Label>Field Label</Label>);
      expect(screen.getByText('Field Label').tagName).toBe('LABEL');
    });

    it('renders children text', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('applies base label class', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles.label);
    });

    it('applies custom className', () => {
      render(<Label className='custom-label'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');
      expect(label).toHaveClass(styles.label);
    });
  });

  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Label size={size}>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles[`label-${size}`]);
    });

    it('defaults to small size', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles['label-small']);
    });
  });

  describe('Required Indicator', () => {
    it('shows required indicator when required', () => {
      render(<Label required>Field</Label>);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not show indicator when not required', () => {
      render(<Label>Field</Label>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('supports htmlFor attribute', () => {
      render(<Label htmlFor='username-input'>Username</Label>);
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username-input');
    });

    it('works without htmlFor', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).not.toHaveAttribute('for');
    });
    it('supports id attribute', () => {
      render(<Label id='form-label'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('id', 'form-label');
    });

    it('supports data attributes', () => {
      render(<Label data-testid='test-label'>Label</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });
});
