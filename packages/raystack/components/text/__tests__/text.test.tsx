import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Text } from '../text';
import styles from '../text.module.css';

describe('Text', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Text>Hello World</Text>);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(<Text>Test content</Text>);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      render(<Text>Default element</Text>);

      const span = screen.getByText('Default element');
      expect(span.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('Variant Styling', () => {
    const variants = [
      'primary',
      'secondary',
      'tertiary',
      'emphasis',
      'accent',
      'attention',
      'danger',
      'success'
    ] as const;
    variants.forEach(variant => {
      it(`applies ${variant} variant`, () => {
        const { container } = render(<Text variant={variant}>{variant}</Text>);
        expect(container.firstChild).toHaveClass(styles[`text-${variant}`]);
      });
    });
    it('defaults to primary variant', () => {
      const { container } = render(<Text>Default</Text>);
      expect(container.firstChild).toHaveClass(styles['text-primary']);
    });
  });

  describe('Size Options', () => {
    const sizes = [
      'micro',
      'mini',
      'small',
      'regular',
      'large',
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ] as const;
    sizes.forEach(size => {
      it(`applies ${size} size`, () => {
        const { container } = render(<Text size={size}>{size}</Text>);
        expect(container.firstChild).toHaveClass(styles[`text-${size}`]);
      });
    });
    it('defaults to small size', () => {
      const { container } = render(<Text>Default</Text>);
      expect(container.firstChild).toHaveClass(styles['text-small']);
    });
  });

  describe('Weight Options', () => {
    const weights = [
      'regular',
      'medium',
      'bold',
      'bolder',
      'normal',
      'lighter',
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900
    ] as const;
    weights.forEach(weight => {
      it(`applies ${weight} weight`, () => {
        const { container } = render(<Text weight={weight}>{weight}</Text>);
        expect(container.firstChild).toHaveClass(
          styles[`text-weight-${weight}`]
        );
      });
    });
    it('defaults to regular weight', () => {
      const { container } = render(<Text>Default</Text>);
      expect(container.firstChild).toHaveClass(styles['text-weight-regular']);
    });
  });

  describe('Text Transformations', () => {
    it('applies capitalize transform', () => {
      const { container } = render(
        <Text transform='capitalize'>capitalize text</Text>
      );

      expect(container.firstChild).toHaveClass(
        styles['text-transform-capitalize']
      );
    });

    it('applies uppercase transform', () => {
      const { container } = render(
        <Text transform='uppercase'>uppercase text</Text>
      );

      expect(container.firstChild).toHaveClass(
        styles['text-transform-uppercase']
      );
    });

    it('applies lowercase transform', () => {
      const { container } = render(
        <Text transform='lowercase'>LOWERCASE TEXT</Text>
      );

      expect(container.firstChild).toHaveClass(
        styles['text-transform-lowercase']
      );
    });
  });

  describe('Text Alignment', () => {
    it('applies center alignment', () => {
      const { container } = render(<Text align='center'>Centered text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-align-center']);
    });

    it('applies start alignment', () => {
      const { container } = render(
        <Text align='start'>Start aligned text</Text>
      );

      expect(container.firstChild).toHaveClass(styles['text-align-start']);
    });

    it('applies end alignment', () => {
      const { container } = render(<Text align='end'>End aligned text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-align-end']);
    });

    it('applies justify alignment', () => {
      const { container } = render(<Text align='justify'>Justified text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-align-justify']);
    });
  });

  describe('Style Modifiers', () => {
    it('applies underline', () => {
      const { container } = render(<Text underline>Underlined text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-underline']);
    });

    it('applies strikeThrough', () => {
      const { container } = render(
        <Text strikeThrough>Strike through text</Text>
      );

      expect(container.firstChild).toHaveClass(styles['text-strike-through']);
    });

    it('applies italic', () => {
      const { container } = render(<Text italic>Italic text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-italic']);
    });

    it('applies compound variant for strikeThrough and underline', () => {
      const { container } = render(
        <Text strikeThrough underline>
          Combined styles
        </Text>
      );

      expect(container.firstChild).toHaveClass(styles['text-strike-through']);
      expect(container.firstChild).toHaveClass(styles['text-underline']);
      expect(container.firstChild).toHaveClass(
        styles['text-italic-strike-through']
      );
    });
  });

  describe('As Rendering', () => {
    it('renders as div when specified', () => {
      render(<Text as='div'>Div text</Text>);

      const div = screen.getByText('Div text');
      expect(div.tagName.toLowerCase()).toBe('div');
    });

    it('renders as paragraph when specified', () => {
      render(<Text as='p'>Paragraph text</Text>);

      const p = screen.getByText('Paragraph text');
      expect(p.tagName.toLowerCase()).toBe('p');
    });

    it('renders as label when specified', () => {
      render(<Text as='label'>Label text</Text>);

      const label = screen.getByText('Label text');
      expect(label.tagName.toLowerCase()).toBe('label');
    });

    it('renders as anchor when specified', () => {
      render(
        <Text as='a' href='#test'>
          Link text
        </Text>
      );

      const a = screen.getByText('Link text');
      expect(a.tagName.toLowerCase()).toBe('a');
      expect(a).toHaveAttribute('href', '#test');
    });

    it('forwards props to the correct element type', () => {
      render(
        <Text as='label' htmlFor='test-input'>
          Label for input
        </Text>
      );

      const label = screen.getByText('Label for input');
      expect(label).toHaveAttribute('for', 'test-input');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards HTML attributes', () => {
      render(
        <Text id='test-text' data-testid='text-element' aria-label='Test text'>
          Attributed text
        </Text>
      );

      const text = screen.getByTestId('text-element');
      expect(text).toHaveAttribute('id', 'test-text');
      expect(text).toHaveAttribute('aria-label', 'Test text');
    });

    it('handles style prop', () => {
      const { container } = render(
        <Text style={{ color: 'red', fontSize: '18px' }}>Styled text</Text>
      );

      const text = container.firstChild;
      expect(text).toHaveStyle({ color: 'rgb(255, 0, 0)', fontSize: '18px' });
    });

    it('handles event handlers', () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Text onClick={handleClick} onMouseEnter={handleMouseEnter}>
          Interactive text
        </Text>
      );

      const text = screen.getByText('Interactive text');

      fireEvent.click(text);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(text);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('supports ARIA attributes', () => {
      render(
        <Text role='heading' aria-level={2} aria-describedby='description'>
          Accessible heading
        </Text>
      );

      const text = screen.getByRole('heading');
      expect(text).toHaveAttribute('aria-level', '2');
      expect(text).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Children', () => {
    it('renders with null children', () => {
      const { container } = render(<Text>{null}</Text>);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      const { container } = render(<Text>{undefined}</Text>);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with number children', () => {
      render(<Text>{42}</Text>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with boolean children', () => {
      render(<Text>{true}</Text>);

      // Boolean values don't render as text content but component should not crash
      const { container } = render(<Text>{true}</Text>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with React elements as children', () => {
      render(
        <Text>
          <span>Nested element</span>
        </Text>
      );

      expect(screen.getByText('Nested element')).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      const { container } = render(<Text>{``}</Text>);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.textContent).toBe('');
    });
  });
});
