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

    it('renders as h2 by default', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading.tagName).toBe('H2');
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

  describe('Weight', () => {
    it('renders regular weight correctly', () => {
      render(<Headline weight='regular'>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles['headline-weight-regular']);
    });

    it('renders medium weight correctly', () => {
      render(<Headline weight='medium'>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles['headline-weight-medium']);
    });

    it('defaults to medium weight', () => {
      render(<Headline>Heading</Headline>);
      const heading = screen.getByText('Heading');
      expect(heading).toHaveClass(styles['headline-weight-medium']);
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

  describe('Custom Content', () => {
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
