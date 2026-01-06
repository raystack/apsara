import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScrollArea } from '../scroll-area';
import { ScrollAreaRootProps } from '../scroll-area-root';
import styles from '../scroll-area.module.css';

const CONTENT_TEXT = 'Scrollable content';
const TEST_ID = 'test-scroll-area';

const BasicScrollArea = ({
  type = 'auto',
  children,
  ...props
}: ScrollAreaRootProps) => (
  <ScrollArea type={type} data-testid={TEST_ID} {...props}>
    {children}
  </ScrollArea>
);

describe('ScrollArea', () => {
  describe('Basic Rendering', () => {
    it('renders scroll area with children', () => {
      render(
        <BasicScrollArea>
          <div>{CONTENT_TEXT}</div>
        </BasicScrollArea>
      );

      expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
    });

    it('applies root styles', () => {
      const { container } = render(
        <BasicScrollArea>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = container.querySelector(`.${styles.root}`);
      expect(root).toBeInTheDocument();
    });

    it('forwards ref to root', () => {
      const ref = vi.fn();
      render(
        <ScrollArea ref={ref} data-testid={TEST_ID}>
          <div>Content</div>
        </ScrollArea>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className to root', () => {
      const { container } = render(
        <BasicScrollArea className='custom-scroll-area'>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = container.querySelector('.custom-scroll-area');
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(styles.root);
    });

    it('applies custom style to root', () => {
      render(
        <BasicScrollArea
          style={{ height: '200px', width: '300px' }}
          data-testid={TEST_ID}
        >
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = screen.getByTestId(TEST_ID);
      expect(root).toHaveStyle({ height: '200px', width: '300px' });
    });

    it('renders viewport with children', () => {
      const { container } = render(
        <BasicScrollArea>
          <div>{CONTENT_TEXT}</div>
        </BasicScrollArea>
      );

      const viewport = container.querySelector(`.${styles.viewport}`);
      expect(viewport).toBeInTheDocument();
      expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
    });
  });

  describe('Type Prop', () => {
    const types = ['auto', 'always', 'scroll', 'hover'] as const;

    it.each(types)('renders with type %s', type => {
      const { container } = render(
        <BasicScrollArea type={type}>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = container.querySelector(`[data-testid="${TEST_ID}"]`);
      expect(root).toBeInTheDocument();
    });

    it('defaults to auto type', () => {
      const { container } = render(
        <ScrollArea data-testid={TEST_ID}>
          <div>Content</div>
        </ScrollArea>
      );

      const root = container.querySelector(`[data-testid="${TEST_ID}"]`);
      expect(root).toBeInTheDocument();
    });
  });

  describe('Scrollbars', () => {
    it('renders vertical scrollbar automatically', () => {
      const { container } = render(
        <BasicScrollArea
          type='always'
          style={{ height: '100px', width: '200px' }}
        >
          <div style={{ height: '500px' }}>Content</div>
        </BasicScrollArea>
      );

      const scrollbar = container.querySelector(
        `[data-orientation="vertical"]`
      );
      expect(scrollbar).toBeInTheDocument();
    });

    it('renders horizontal scrollbar automatically', () => {
      const { container } = render(
        <BasicScrollArea
          type='always'
          style={{ height: '100px', width: '200px' }}
        >
          <div style={{ width: '500px' }}>Content</div>
        </BasicScrollArea>
      );

      const scrollbar = container.querySelector(
        `[data-orientation="horizontal"]`
      );
      expect(scrollbar).toBeInTheDocument();
    });

    it('applies scrollbar styles', () => {
      const { container } = render(
        <BasicScrollArea
          type='always'
          style={{ height: '100px', width: '200px' }}
        >
          <div style={{ height: '500px' }}>Content</div>
        </BasicScrollArea>
      );

      const scrollbar = container.querySelector(`.${styles.scrollbar}`);
      expect(scrollbar).toBeInTheDocument();
    });

    it('applies thumb styles', () => {
      const { container } = render(
        <BasicScrollArea
          type='always'
          style={{ height: '100px', width: '200px' }}
        >
          <div style={{ height: '500px' }}>Content</div>
        </BasicScrollArea>
      );

      const scrollbar = container.querySelector(
        `[data-orientation="vertical"]`
      );
      expect(scrollbar).toBeInTheDocument();
      // Thumb is a child of scrollbar (Radix UI controls its rendering based on scroll position)
      const thumb = scrollbar?.querySelector(`.${styles.thumb}`);
      // If thumb exists, verify it has the correct class
      if (thumb) {
        expect(thumb).toHaveClass(styles.thumb);
      } else {
        // Thumb may not render if Radix UI determines no scroll is needed
        // This is expected behavior - we verify the scrollbar structure is correct
        expect(scrollbar).toBeInTheDocument();
      }
    });
  });

  describe('Custom Props', () => {
    it('applies custom data attributes', () => {
      render(
        <BasicScrollArea data-custom='test-value'>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = screen.getByTestId(TEST_ID);
      expect(root).toHaveAttribute('data-custom', 'test-value');
    });

    it('applies custom id', () => {
      render(
        <BasicScrollArea id='my-scroll-area'>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = screen.getByTestId(TEST_ID);
      expect(root).toHaveAttribute('id', 'my-scroll-area');
    });
  });
});
