import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Image } from '../image';
import styles from '../image.module.css';

describe('Image', () => {
  describe('Basic Rendering', () => {
    it('renders img element', () => {
      render(<Image src='/test.jpg' alt='Test image' />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });

    it('sets src attribute', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/test.jpg');
    });

    it('sets alt attribute', () => {
      render(<Image src='/test.jpg' alt='Description' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Description');
    });

    it('defaults alt to empty string', () => {
      render(<Image src='/test.jpg' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('applies base image class', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass(styles.image);
    });

    it('applies custom className', () => {
      render(<Image src='/test.jpg' alt='Test' className='custom-image' />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-image');
      expect(img).toHaveClass(styles.image);
    });
  });

  describe('Fit Variants', () => {
    const fits = ['contain', 'cover', 'fill'] as const;

    it.each(fits)('renders %s fit correctly', fit => {
      render(<Image src='/test.jpg' alt='Test' fit={fit} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass(styles[`image-${fit}`]);
    });

    it('defaults to cover fit', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass(styles['image-cover']);
    });
  });

  describe('Radius Variants', () => {
    const radiuses = ['none', 'small', 'medium', 'full'] as const;

    it.each(radiuses)('renders %s radius correctly', radius => {
      render(<Image src='/test.jpg' alt='Test' radius={radius} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass(styles[`image-radius-${radius}`]);
    });

    it('defaults to none radius', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass(styles['image-radius-none']);
    });
  });

  describe('Dimensions', () => {
    it('sets width as string', () => {
      render(<Image src='/test.jpg' alt='Test' width='200px' />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ width: '200px' });
    });

    it('sets width as number', () => {
      render(<Image src='/test.jpg' alt='Test' width={300} />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ width: '300px' });
    });

    it('sets height as string', () => {
      render(<Image src='/test.jpg' alt='Test' height='150px' />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ height: '150px' });
    });

    it('sets height as number', () => {
      render(<Image src='/test.jpg' alt='Test' height={200} />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ height: '200px' });
    });

    it('sets both width and height', () => {
      render(<Image src='/test.jpg' alt='Test' width='400px' height='300px' />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ width: '400px', height: '300px' });
    });
  });

  describe('Error Handling', () => {
    it('calls onError when image fails to load', () => {
      const handleError = vi.fn();
      render(<Image src='/invalid.jpg' alt='Test' onError={handleError} />);
      const img = screen.getByRole('img');

      fireEvent.error(img);
      expect(handleError).toHaveBeenCalled();
    });

    it('sets fallback src on error', () => {
      render(<Image src='/invalid.jpg' alt='Test' fallback='/fallback.jpg' />);
      const img = screen.getByRole('img') as HTMLImageElement;

      fireEvent.error(img);
      expect(img.src).toContain('/fallback.jpg');
    });
  });

  describe('Loading Attributes', () => {
    it('sets loading="lazy" by default', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('can override loading attribute', () => {
      render(<Image src='/test.jpg' alt='Test' loading='eager' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('sets decoding="async" by default', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('decoding', 'async');
    });

    it('can override decoding attribute', () => {
      render(<Image src='/test.jpg' alt='Test' decoding='sync' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('decoding', 'sync');
    });
  });

  describe('Accessibility', () => {
    it('has role="img"', () => {
      render(<Image src='/test.jpg' alt='Test' />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('sets aria-label to alt text', () => {
      render(<Image src='/test.jpg' alt='Descriptive text' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('aria-label', 'Descriptive text');
    });

    it('sets empty aria-label when alt is empty', () => {
      render(<Image src='/test.jpg' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('aria-label', '');
    });
  });

  describe('HTML Attributes', () => {
    it('supports title attribute', () => {
      render(<Image src='/test.jpg' alt='Test' title='Hover text' />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('title', 'Hover text');
    });

    it('supports data attributes', () => {
      render(<Image src='/test.jpg' alt='Test' data-testid='test-image' />);
      expect(screen.getByTestId('test-image')).toBeInTheDocument();
    });

    it('supports style attribute', () => {
      render(<Image src='/test.jpg' alt='Test' style={{ opacity: 0.5 }} />);
      const img = screen.getByRole('img');
      expect(img).toHaveStyle({ opacity: '0.5' });
    });

    it('supports srcSet attribute', () => {
      render(
        <Image
          src='/test.jpg'
          alt='Test'
          srcSet='/test-2x.jpg 2x, /test-3x.jpg 3x'
        />
      );
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('srcSet', '/test-2x.jpg 2x, /test-3x.jpg 3x');
    });

    it('supports sizes attribute', () => {
      render(
        <Image
          src='/test.jpg'
          alt='Test'
          sizes='(max-width: 768px) 100vw, 50vw'
        />
      );
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    });
  });

  describe('Event Handlers', () => {
    it('handles onLoad event', () => {
      const handleLoad = vi.fn();
      render(<Image src='/test.jpg' alt='Test' onLoad={handleLoad} />);
      const img = screen.getByRole('img');

      fireEvent.load(img);
      expect(handleLoad).toHaveBeenCalled();
    });

    it('handles onClick event', () => {
      const handleClick = vi.fn();
      render(<Image src='/test.jpg' alt='Test' onClick={handleClick} />);
      const img = screen.getByRole('img');

      fireEvent.click(img);
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
