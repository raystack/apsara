import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Headline } from '../headline';
import styles from '../headline.module.css';

describe('Headline', () => {
  describe('Basic Rendering', () => {
    it('renders with children text', () => {
      render(<Headline>Test Headline</Headline>);
      expect(screen.getByText('Test Headline')).toBeInTheDocument();
    });

    it('renders as h2 by default', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe('H2');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Headline ref={ref}>Heading</Headline>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies base headline class', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles.headline);
    });

    it('applies custom className', () => {
      render(<Headline className='custom-class'>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass('custom-class');
      expect(heading).toHaveClass(styles.headline);
    });
  });

  describe('As Prop', () => {
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

    it.each(headingLevels)('renders as %s element', level => {
      render(<Headline as={level}>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe(level.toUpperCase());
    });
  });

  describe('Sizes', () => {
    const sizes = ['t1', 't2', 't3', 't4', 'small', 'medium', 'large'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Headline size={size}>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles[`headline-${size}`]);
    });

    it('defaults to t2 size', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles['headline-t2']);
    });
  });

  describe('Alignment', () => {
    const alignments = ['left', 'center', 'right'] as const;

    it.each(alignments)('renders %s alignment correctly', align => {
      render(<Headline align={align}>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles[`headline-align-${align}`]);
    });

    it('defaults to left alignment', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles['headline-align-left']);
    });
  });

  describe('Truncate', () => {
    it('applies truncate class when true', () => {
      render(
        <Headline truncate>Long heading text that might overflow</Headline>
      );
      const heading = screen.getByText('Long heading text that might overflow');
      expect(heading).toHaveClass(styles['headline-truncate']);
    });

    it('does not apply truncate class when false', () => {
      render(<Headline truncate={false}>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).not.toHaveClass(styles['headline-truncate']);
    });

    it('defaults to not truncating', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).not.toHaveClass(styles['headline-truncate']);
    });
  });

  describe('HTML Attributes', () => {
    it('supports id attribute', () => {
      render(<Headline id='main-heading'>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('id', 'main-heading');
    });

    it('supports data attributes', () => {
      render(<Headline data-testid='test-headline'>Heading</Headline>);
      expect(screen.getByTestId('test-headline')).toBeInTheDocument();
    });

    // it('supports style attribute', () => {
    //   render(
    //     <Headline style={{ color: 'red', margin: '10px' }}>Heading</Headline>
    //   );
    //   const heading = screen.getByText('Heading');
    //   expect(heading).toHaveStyle({ color: 'red', margin: '10px' });
    // });

    it('supports title attribute', () => {
      render(<Headline title='Tooltip text'>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('title', 'Tooltip text');
    });

    it('supports aria attributes', () => {
      render(
        <Headline aria-label='Main heading' aria-level={1}>
          Heading
        </Headline>
      );
      const heading = screen.getByText('Heading');
      expect(heading).toHaveAttribute('aria-label', 'Main heading');
      expect(heading).toHaveAttribute('aria-level', '1');
    });
  });

  describe('Event Handlers', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Headline onClick={handleClick}>Heading</Headline>);
      const heading = screen.getByText('Heading');
      heading.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // it('handles mouse events', () => {
    //   const handleMouseEnter = vi.fn();
    //   const handleMouseLeave = vi.fn();
    //   render(
    //     <Headline
    //       onMouseEnter={handleMouseEnter}
    //       onMouseLeave={handleMouseLeave}
    //     >
    //       Heading
    //     </Headline>
    //   );
    //   const heading = screen.getByText('Heading');

    //   heading.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    //   expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    //   heading.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    //   expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    // });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      render(
        <Headline
          as='h1'
          size='t1'
          align='center'
          truncate
          className='custom'
          id='main'
        >
          Main Title
        </Headline>
      );

      const heading = screen.getByText('Main Title');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass(styles['headline-t1']);
      expect(heading).toHaveClass(styles['headline-align-center']);
      expect(heading).toHaveClass(styles['headline-truncate']);
      expect(heading).toHaveClass('custom');
      expect(heading).toHaveAttribute('id', 'main');
    });

    it('renders different size and alignment combinations', () => {
      const { rerender } = render(
        <Headline size='small' align='left'>
          Small Left
        </Headline>
      );
      let heading = screen.getByText('Small Left');
      expect(heading).toHaveClass(styles['headline-small']);
      expect(heading).toHaveClass(styles['headline-align-left']);

      rerender(
        <Headline size='large' align='right'>
          Large Right
        </Headline>
      );
      heading = screen.getByText('Large Right');
      expect(heading).toHaveClass(styles['headline-large']);
      expect(heading).toHaveClass(styles['headline-align-right']);
    });
  });

  describe('Content Types', () => {
    it('renders with JSX children', () => {
      render(
        <Headline>
          <span>Complex</span> <strong>Content</strong>
        </Headline>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with number children', () => {
      render(<Headline>{2024}</Headline>);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders empty headline', () => {
      const { container } = render(<Headline />);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('');
    });
  });
});
