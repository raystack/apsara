import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScrollArea, ScrollAreaProps } from '../scroll-area';
import styles from '../scroll-area.module.css';

const CONTENT_TEXT = 'Scrollable content';
const TEST_ID = 'test-scroll-area';

const BasicScrollArea = ({
  type = 'hover',
  children,
  ...props
}: ScrollAreaProps) => (
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
    const types = ['always', 'hover', 'scroll'] as const;

    it.each(types)('renders with type %s', type => {
      const { container } = render(
        <BasicScrollArea type={type}>
          <div>Content</div>
        </BasicScrollArea>
      );

      const root = container.querySelector(`[data-testid="${TEST_ID}"]`);
      expect(root).toBeInTheDocument();

      // Check scrollbar has the correct type class
      const scrollbar = container.querySelector(`.${styles.scrollbar}`);
      expect(scrollbar).toHaveClass(styles[`scrollbar-${type}`]);
    });

    it('defaults to hover type', () => {
      const { container } = render(
        <ScrollArea data-testid={TEST_ID}>
          <div>Content</div>
        </ScrollArea>
      );

      const scrollbar = container.querySelector(`.${styles.scrollbar}`);
      expect(scrollbar).toHaveClass(styles['scrollbar-hover']);
    });
  });

  describe('Scrollbars', () => {
    it('renders vertical scrollbar', () => {
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

    it('renders horizontal scrollbar', () => {
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

      const thumb = container.querySelector(`.${styles.thumb}`);
      expect(thumb).toBeInTheDocument();
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
