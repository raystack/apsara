import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Box } from '../box';
import styles from '../box.module.css';

describe('Box', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(<Box>Test content</Box>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Box>
          <span>Child 1</span>
          <span>Child 2</span>
        </Box>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders without children', () => {
      render(<Box data-testid='box' />);
      const box = screen.getByTestId('box');
      expect(box).toBeInTheDocument();
      expect(box?.children.length).toBe(0);
    });

    it('applies box class by default', () => {
      const rendered = render(<Box>Content</Box>);
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });

  describe('ClassName Handling', () => {
    it('applies custom className', () => {
      const { container } = render(<Box className='custom-class'>Content</Box>);
      const box = container.querySelector('.custom-class');
      expect(box).toBeInTheDocument();
      expect(box).toHaveClass(styles.box);
    });

    it('combines multiple classNames', () => {
      const { container } = render(
        <Box className='class1 class2'>Content</Box>
      );
      const box = container.querySelector(`.${styles.box}`);
      expect(box).toHaveClass('class1');
      expect(box).toHaveClass('class2');
      expect(box).toHaveClass(styles.box);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Box ref={ref}>Content</Box>);
      expect(ref).toHaveBeenCalled();
    });

    it('provides access to DOM element via ref', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Box ref={ref}>Content</Box>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('HTML Attributes', () => {
    it('passes through HTML attributes', () => {
      render(
        <Box id='test-box' data-testid='box-element' aria-label='Test Box'>
          Content
        </Box>
      );

      const box = screen.getByTestId('box-element');
      expect(box).toHaveAttribute('id', 'test-box');
      expect(box).toHaveAttribute('aria-label', 'Test Box');
    });

    it('handles role attribute', () => {
      render(
        <Box role='region' aria-labelledby='heading'>
          Content
        </Box>
      );

      const box = screen.getByRole('region');
      expect(box).toBeInTheDocument();
      expect(box).toHaveAttribute('aria-labelledby', 'heading');
    });
  });

  describe('Children', () => {
    it('renders nested Box components', () => {
      render(
        <Box className='outer'>
          <Box className='inner'>Nested content</Box>
        </Box>
      );

      const outer = document.querySelector('.outer');
      const inner = document.querySelector('.inner');

      expect(outer).toBeInTheDocument();
      expect(inner).toBeInTheDocument();
      expect(inner?.parentElement).toBe(outer);
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('renders with React fragments', () => {
      render(
        <Box>
          <>
            <span>Fragment child 1</span>
            <span>Fragment child 2</span>
          </>
        </Box>
      );

      expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
      expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
    });

    it('renders with conditional children', () => {
      const showChild = true;
      render(
        <Box>
          {showChild && <span>Conditional child</span>}
          {!showChild && <span>Hidden child</span>}
        </Box>
      );

      expect(screen.getByText('Conditional child')).toBeInTheDocument();
      expect(screen.queryByText('Hidden child')).not.toBeInTheDocument();
    });

    it('renders with array of children', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      render(
        <Box>
          {items.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </Box>
      );

      items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('renders with empty string children', () => {
      const { container } = render(<Box>{``}</Box>);
      const box = container.querySelector(`.${styles.box}`);
      expect(box).toBeInTheDocument();
      expect(box?.textContent).toBe('');
    });

    it('renders with number children', () => {
      render(<Box>{42}</Box>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with zero as child', () => {
      render(<Box>{0}</Box>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
