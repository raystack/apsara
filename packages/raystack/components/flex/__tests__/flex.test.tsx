import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Flex } from '../flex';
import styles from '../flex.module.css';

describe('Flex', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      render(<Flex>Content</Flex>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(<Flex>Test</Flex>);
      const element = container.firstChild;
      expect(element?.nodeName).toBe('DIV');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Flex ref={ref}>Content</Flex>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Flex className='custom-class'>Content</Flex>
      );
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass('custom-class');
      expect(flex).toHaveClass(styles.flex);
    });
  });

  describe('Direction', () => {
    const directions = [
      'row',
      'column',
      'rowReverse',
      'columnReverse'
    ] as const;

    it.each(directions)('renders %s direction correctly', direction => {
      const { container } = render(<Flex direction={direction}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles[`direction-${direction}`]);
    });

    it('defaults to row direction', () => {
      const { container } = render(<Flex>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['direction-row']);
    });
  });

  describe('Alignment', () => {
    const alignments = [
      'start',
      'center',
      'end',
      'stretch',
      'baseline'
    ] as const;

    it.each(alignments)('renders %s alignment correctly', align => {
      const { container } = render(<Flex align={align}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles[`align-${align}`]);
    });

    it('defaults to stretch alignment', () => {
      const { container } = render(<Flex>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['align-stretch']);
    });
  });

  describe('Justification', () => {
    const justifications = ['start', 'center', 'end', 'between'] as const;

    it.each(justifications)('renders %s justification correctly', justify => {
      const { container } = render(<Flex justify={justify}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles[`justify-${justify}`]);
    });

    it('defaults to start justification', () => {
      const { container } = render(<Flex>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['justify-start']);
    });
  });

  describe('Wrap', () => {
    const wraps = ['noWrap', 'wrap', 'wrapReverse'] as const;

    it.each(wraps)('renders %s wrap correctly', wrap => {
      const { container } = render(<Flex wrap={wrap}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles[`wrap-${wrap}`]);
    });

    it('defaults to noWrap', () => {
      const { container } = render(<Flex>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['wrap-noWrap']);
    });
  });

  describe('Gap', () => {
    const numericGaps = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
    const namedGaps = [
      'extra-small',
      'small',
      'medium',
      'large',
      'extra-large'
    ] as const;

    it.each(numericGaps)('renders gap %s correctly', gap => {
      const { container } = render(<Flex gap={gap}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles[`gap-${gap}`]);
    });

    it.each(namedGaps)('renders %s gap correctly', gap => {
      const { container } = render(<Flex gap={gap}>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      const className =
        gap === 'extra-small'
          ? 'gap-xs'
          : gap === 'extra-large'
            ? 'gap-xl'
            : `gap-${gap.slice(0, 2)}`;
      expect(flex).toHaveClass(styles[className]);
    });
  });

  describe('Width', () => {
    it('renders full width correctly', () => {
      const { container } = render(<Flex width='full'>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['width-full']);
    });

    it('renders without width class when not specified', () => {
      const { container } = render(<Flex>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).not.toHaveClass(styles['width-full']);
    });
  });

  describe('HTML Attributes', () => {
    it('supports data attributes', () => {
      const { container } = render(
        <Flex data-testid='test-flex'>Content</Flex>
      );
      expect(
        container.querySelector('[data-testid="test-flex"]')
      ).toBeInTheDocument();
    });

    it('supports style attribute', () => {
      const { container } = render(
        <Flex style={{ backgroundColor: 'blue' }}>Content</Flex>
      );
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveStyle({ backgroundColor: 'blue' });
    });

    it('supports id attribute', () => {
      const { container } = render(<Flex id='flex-container'>Content</Flex>);
      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveAttribute('id', 'flex-container');
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      const { container } = render(
        <Flex
          direction='column'
          align='center'
          justify='between'
          wrap='wrap'
          gap='large'
          width='full'
          className='custom'
        >
          Content
        </Flex>
      );

      const flex = container.firstChild as HTMLElement;
      expect(flex).toHaveClass(styles['direction-column']);
      expect(flex).toHaveClass(styles['align-center']);
      expect(flex).toHaveClass(styles['justify-between']);
      expect(flex).toHaveClass(styles['wrap-wrap']);
      expect(flex).toHaveClass(styles['gap-lg']);
      expect(flex).toHaveClass(styles['width-full']);
      expect(flex).toHaveClass('custom');
    });

    it('renders multiple children correctly', () => {
      render(
        <Flex>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </Flex>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });
});
