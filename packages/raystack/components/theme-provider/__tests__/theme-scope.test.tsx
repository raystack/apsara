import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeScope } from '../theme-scope';

describe('ThemeScope', () => {
  describe('Default rendering', () => {
    it('renders a div by default with the provided children', () => {
      render(
        <ThemeScope theme='dark' data-testid='scope'>
          <span>inside</span>
        </ThemeScope>
      );

      const node = screen.getByTestId('scope');
      expect(node.tagName).toBe('DIV');
      expect(screen.getByText('inside')).toBeInTheDocument();
    });

    it('writes data-theme when theme is provided', () => {
      render(<ThemeScope theme='dark' data-testid='scope' />);
      expect(screen.getByTestId('scope')).toHaveAttribute('data-theme', 'dark');
    });

    it('omits data attributes when their props are not provided', () => {
      render(<ThemeScope data-testid='scope' />);

      const node = screen.getByTestId('scope');
      expect(node).not.toHaveAttribute('data-theme');
      expect(node).not.toHaveAttribute('data-accent-color');
      expect(node).not.toHaveAttribute('data-gray-color');
      expect(node).not.toHaveAttribute('data-style');
    });

    it('writes every supported data attribute', () => {
      render(
        <ThemeScope
          theme='light'
          accentColor='orange'
          grayColor='mauve'
          styleVariant='traditional'
          data-testid='scope'
        />
      );

      const node = screen.getByTestId('scope');
      expect(node).toHaveAttribute('data-theme', 'light');
      expect(node).toHaveAttribute('data-accent-color', 'orange');
      expect(node).toHaveAttribute('data-gray-color', 'mauve');
      expect(node).toHaveAttribute('data-style', 'traditional');
    });

    it('forwards arbitrary HTML attributes', () => {
      render(
        <ThemeScope
          theme='dark'
          id='my-scope'
          className='custom-class'
          data-testid='scope'
        />
      );

      const node = screen.getByTestId('scope');
      expect(node).toHaveAttribute('id', 'my-scope');
      expect(node).toHaveClass('custom-class');
    });

    it('passes through user-provided style', () => {
      render(
        <ThemeScope
          theme='dark'
          style={{ background: 'red' }}
          data-testid='scope'
        />
      );

      expect(screen.getByTestId('scope')).toHaveStyle({ background: 'red' });
    });
  });

  describe('render prop', () => {
    it('renders the provided element instead of a default div', () => {
      render(
        <ThemeScope theme='dark' render={<section data-testid='scope' />}>
          <span>inside</span>
        </ThemeScope>
      );

      const node = screen.getByTestId('scope');
      expect(node.tagName).toBe('SECTION');
      expect(screen.getByText('inside')).toBeInTheDocument();
    });

    it('merges data attributes onto the rendered element', () => {
      render(
        <ThemeScope
          theme='dark'
          accentColor='mint'
          render={<section data-testid='scope' />}
        />
      );

      const node = screen.getByTestId('scope');
      expect(node).toHaveAttribute('data-theme', 'dark');
      expect(node).toHaveAttribute('data-accent-color', 'mint');
    });

    it('preserves the rendered element’s own attributes alongside the merged ones', () => {
      render(
        <ThemeScope
          theme='light'
          render={
            <section
              id='my-section'
              className='base-class'
              data-testid='scope'
            />
          }
        />
      );

      const node = screen.getByTestId('scope');
      expect(node).toHaveAttribute('id', 'my-section');
      expect(node).toHaveClass('base-class');
      expect(node).toHaveAttribute('data-theme', 'light');
    });
  });
});
