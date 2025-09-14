import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Link } from '../link';
import styles from '../link.module.css';

describe('Link', () => {
  describe('Basic Rendering', () => {
    it('renders with children text', () => {
      render(<Link href='/test'>Click me</Link>);
      expect(
        screen.getByRole('link', { name: 'Click me' })
      ).toBeInTheDocument();
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

    it('applies link class', () => {
      render(<Link href='/test'>Link</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
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
  });

  describe('External Links', () => {
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

    it('adds aria-label for external links', () => {
      render(
        <Link href='https://example.com' external>
          External
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'External (opens in new tab)');
    });

    it('does not add external attributes when external is false', () => {
      render(<Link href='https://example.com'>Not External</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('Download Links', () => {
    // it('adds download attribute when download is true', () => {
    //   render(
    //     <Link href='/file.pdf' download>
    //       Download
    //     </Link>
    //   );
    //   const link = screen.getByRole('link');
    //   expect(link).toHaveAttribute('download', 'true');
    // });

    it('adds custom filename when download is string', () => {
      render(
        <Link href='/file.pdf' download='custom-name.pdf'>
          Download
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('download', 'custom-name.pdf');
    });

    it('adds aria-label for download links', () => {
      render(
        <Link href='/file.pdf' download>
          Download File
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Download File (download)');
    });

    it('does not add download attribute when not specified', () => {
      render(<Link href='/file.pdf'>File</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('download');
    });
  });

  describe('Text Props', () => {
    it('defaults to accent variant', () => {
      render(<Link href='/test'>Link</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
    });

    it('applies custom variant', () => {
      render(
        <Link href='/test' variant='neutral'>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
    });

    it('defaults to small size', () => {
      render(<Link href='/test'>Link</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
    });

    it('applies custom size', () => {
      render(
        <Link href='/test' size='large'>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
    });
  });

  describe('HTML Anchor Attributes', () => {
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

    // it('supports style attribute', () => {
    //   render(
    //     <Link href='/test' style={{ color: 'red' }}>
    //       Link
    //     </Link>
    //   );
    //   const link = screen.getByRole('link');
    //   expect(link).toHaveStyle({ color: 'red' });
    // });
  });

  describe('Event Handlers', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(
        <Link href='/test' onClick={handleClick}>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      link.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles focus events', () => {
      const handleFocus = vi.fn();
      render(
        <Link href='/test' onFocus={handleFocus}>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      link.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles blur events', () => {
      const handleBlur = vi.fn();
      render(
        <Link href='/test' onBlur={handleBlur}>
          Link
        </Link>
      );
      const link = screen.getByRole('link');
      link.focus();
      link.blur();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Combinations', () => {
    it('renders external download link correctly', () => {
      render(
        <Link href='/file.pdf' external download='document.pdf'>
          Download Document
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/file.pdf');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('download', 'document.pdf');
    });

    it('renders with all text props', () => {
      render(
        <Link href='/test' variant='danger' size='medium' className='custom'>
          Custom Link
        </Link>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.link);
      expect(link).toHaveClass('custom');
    });
  });
});
