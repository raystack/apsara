import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Link } from '../link';
import styles from '../link.module.css';

describe('Link', () => {
  describe('Basic Rendering', () => {
    it('renders with children text', () => {
      render(<Link href='/test'>Click me</Link>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as anchor element', () => {
      render(<Link href='/test'>Link</Link>);
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Link href='/test' ref={ref}>
          Link
        </Link>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(
        <Link href='/test' className='custom-link'>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
      expect(link).toHaveClass(styles.link);
    });
  });

  describe('Href Attribute', () => {
    it('sets href attribute correctly', () => {
      render(<Link href='https://example.com'>External</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('handles relative URLs', () => {
      render(<Link href='/about'>About</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about');
    });

    it('handles hash links', () => {
      render(<Link href='#section'>Section</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '#section');
    });
    it('adds target="_blank" for external links', () => {
      render(
        <Link href='https://example.com' external>
          External
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('adds rel="noopener noreferrer" for external links', () => {
      render(
        <Link href='https://example.com' external>
          External
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('HTML Attributes', () => {
    it('supports title attribute', () => {
      render(
        <Link href='/test' title='Link title'>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('title', 'Link title');
    });

    it('supports id attribute', () => {
      render(
        <Link href='/test' id='main-link'>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('id', 'main-link');
    });

    it('supports data attributes', () => {
      render(
        <Link href='/test' data-testid='test-link'>
          Link
        </Link>
      );
      expect(screen.getByTestId('test-link')).toBeInTheDocument();
    });
  });
});
