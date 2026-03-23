import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Fieldset } from '../fieldset';
import styles from '../fieldset.module.css';

describe('Fieldset', () => {
  describe('Basic Rendering', () => {
    it('renders a fieldset element', () => {
      const { container } = render(<Fieldset>content</Fieldset>);
      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toBeInTheDocument();
    });

    it('applies fieldset class', () => {
      const { container } = render(<Fieldset>content</Fieldset>);
      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toHaveClass(styles.fieldset);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Fieldset className='custom-fieldset'>content</Fieldset>
      );
      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toHaveClass('custom-fieldset');
      expect(fieldset).toHaveClass(styles.fieldset);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Fieldset ref={ref}>content</Fieldset>);
      expect(ref).toHaveBeenCalled();
    });

    it('renders children', () => {
      render(
        <Fieldset>
          <input data-testid='child' />
        </Fieldset>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Simple API - Legend', () => {
    it('renders legend text', () => {
      render(<Fieldset legend='Personal Info'>content</Fieldset>);
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    it('applies legend class', () => {
      render(<Fieldset legend='Info'>content</Fieldset>);
      const legend = screen.getByText('Info');
      expect(legend).toHaveClass(styles.legend);
    });

    it('applies custom legendClassName', () => {
      render(
        <Fieldset legend='Info' legendClassName='custom-legend'>
          content
        </Fieldset>
      );
      const legend = screen.getByText('Info');
      expect(legend).toHaveClass('custom-legend');
      expect(legend).toHaveClass(styles.legend);
    });

    it('does not render legend when not provided', () => {
      const { container } = render(<Fieldset>content</Fieldset>);
      expect(
        container.querySelector('[role="presentation"]')
      ).not.toBeInTheDocument();
    });
  });

  describe('Sub-component API', () => {
    it('renders Fieldset.Legend', () => {
      render(
        <Fieldset>
          <Fieldset.Legend>Custom Legend</Fieldset.Legend>
        </Fieldset>
      );
      expect(screen.getByText('Custom Legend')).toBeInTheDocument();
    });

    it('applies custom className to Fieldset.Legend', () => {
      render(
        <Fieldset>
          <Fieldset.Legend className='custom-cls'>Legend</Fieldset.Legend>
        </Fieldset>
      );
      const legend = screen.getByText('Legend');
      expect(legend).toHaveClass('custom-cls');
      expect(legend).toHaveClass(styles.legend);
    });
  });

  describe('Disabled State', () => {
    it('sets data-disabled attribute when disabled', () => {
      const { container } = render(
        <Fieldset disabled>
          <input data-testid='child-input' />
        </Fieldset>
      );
      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toHaveAttribute('data-disabled', '');
    });
  });
});
