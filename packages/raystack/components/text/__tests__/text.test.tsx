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

    it('applies base text classes', () => {
      const { container } = render(<Text>Test</Text>);

      const textElement = container.firstChild;
      expect(textElement).toHaveClass(styles.text);
      expect(textElement).toHaveClass(styles['text-primary']); // default variant
      expect(textElement).toHaveClass(styles['text-small']); // default size
      expect(textElement).toHaveClass(styles['text-weight-regular']); // default weight
    });

    it('renders as span by default', () => {
      render(<Text>Default element</Text>);

      const span = screen.getByText('Default element');
      expect(span.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('Variant Styling', () => {
    it('applies primary variant', () => {
      const { container } = render(<Text variant='primary'>Primary</Text>);

      expect(container.firstChild).toHaveClass(styles['text-primary']);
    });

    it('applies secondary variant', () => {
      const { container } = render(<Text variant='secondary'>Secondary</Text>);

      expect(container.firstChild).toHaveClass(styles['text-secondary']);
    });

    it('applies tertiary variant', () => {
      const { container } = render(<Text variant='tertiary'>Tertiary</Text>);

      expect(container.firstChild).toHaveClass(styles['text-tertiary']);
    });

    it('applies emphasis variant', () => {
      const { container } = render(<Text variant='emphasis'>Emphasis</Text>);

      expect(container.firstChild).toHaveClass(styles['text-emphasis']);
    });

    it('applies accent variant', () => {
      const { container } = render(<Text variant='accent'>Accent</Text>);

      expect(container.firstChild).toHaveClass(styles['text-accent']);
    });

    it('applies attention variant', () => {
      const { container } = render(<Text variant='attention'>Attention</Text>);

      expect(container.firstChild).toHaveClass(styles['text-attention']);
    });

    it('applies danger variant', () => {
      const { container } = render(<Text variant='danger'>Danger</Text>);

      expect(container.firstChild).toHaveClass(styles['text-danger']);
    });

    it('applies success variant', () => {
      const { container } = render(<Text variant='success'>Success</Text>);

      expect(container.firstChild).toHaveClass(styles['text-success']);
    });
  });

  describe('Size Options', () => {
    describe('Named sizes', () => {
      it('applies micro size', () => {
        const { container } = render(<Text size='micro'>Micro</Text>);

        expect(container.firstChild).toHaveClass(styles['text-micro']);
      });

      it('applies mini size', () => {
        const { container } = render(<Text size='mini'>Mini</Text>);

        expect(container.firstChild).toHaveClass(styles['text-mini']);
      });

      it('applies small size', () => {
        const { container } = render(<Text size='small'>Small</Text>);

        expect(container.firstChild).toHaveClass(styles['text-small']);
      });

      it('applies regular size', () => {
        const { container } = render(<Text size='regular'>Regular</Text>);

        expect(container.firstChild).toHaveClass(styles['text-regular']);
      });

      it('applies large size', () => {
        const { container } = render(<Text size='large'>Large</Text>);

        expect(container.firstChild).toHaveClass(styles['text-large']);
      });
    });

    describe('Numbered sizes', () => {
      it('applies size 1', () => {
        const { container } = render(<Text size={1}>Size 1</Text>);

        expect(container.firstChild).toHaveClass(styles['text-1']);
      });

      it('applies size 5', () => {
        const { container } = render(<Text size={5}>Size 5</Text>);

        expect(container.firstChild).toHaveClass(styles['text-5']);
      });

      it('applies size 10', () => {
        const { container } = render(<Text size={10}>Size 10</Text>);

        expect(container.firstChild).toHaveClass(styles['text-10']);
      });
    });
  });

  describe('Weight Options', () => {
    describe('Named weights', () => {
      it('applies regular weight', () => {
        const { container } = render(<Text weight='regular'>Regular</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-regular']);
      });

      it('applies medium weight', () => {
        const { container } = render(<Text weight='medium'>Medium</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-medium']);
      });

      it('applies bold weight', () => {
        const { container } = render(<Text weight='bold'>Bold</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-bold']);
      });

      it('applies bolder weight', () => {
        const { container } = render(<Text weight='bolder'>Bolder</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-bolder']);
      });

      it('applies normal weight', () => {
        const { container } = render(<Text weight='normal'>Normal</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-normal']);
      });

      it('applies lighter weight', () => {
        const { container } = render(<Text weight='lighter'>Lighter</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-lighter']);
      });
    });

    describe('Numbered weights', () => {
      it('applies weight 100', () => {
        const { container } = render(<Text weight={100}>Weight 100</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-100']);
      });

      it('applies weight 500', () => {
        const { container } = render(<Text weight={500}>Weight 500</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-500']);
      });

      it('applies weight 900', () => {
        const { container } = render(<Text weight={900}>Weight 900</Text>);

        expect(container.firstChild).toHaveClass(styles['text-weight-900']);
      });
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

  describe('Line Clamping', () => {
    it('applies 1 line clamp', () => {
      const { container } = render(<Text lineClamp={1}>Single line text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-line-clamp']);
      expect(container.firstChild).toHaveClass(styles['text-line-clamp-1']);
    });

    it('applies 3 line clamp', () => {
      const { container } = render(<Text lineClamp={3}>Multi line text</Text>);

      expect(container.firstChild).toHaveClass(styles['text-line-clamp']);
      expect(container.firstChild).toHaveClass(styles['text-line-clamp-3']);
    });

    it('applies 5 line clamp', () => {
      const { container } = render(
        <Text lineClamp={5}>Many lines of text</Text>
      );

      expect(container.firstChild).toHaveClass(styles['text-line-clamp']);
      expect(container.firstChild).toHaveClass(styles['text-line-clamp-5']);
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

  describe('Polymorphic Rendering', () => {
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

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Text className='custom-text'>Custom styled</Text>
      );

      expect(container.firstChild).toHaveClass('custom-text');
      expect(container.firstChild).toHaveClass(styles.text); // Still applies base class
    });

    it('combines custom className with variant classes', () => {
      const { container } = render(
        <Text
          className='custom-text'
          variant='accent'
          size='large'
          weight='bold'
        >
          Styled text
        </Text>
      );

      const element = container.firstChild;
      expect(element).toHaveClass('custom-text');
      expect(element).toHaveClass(styles['text-accent']);
      expect(element).toHaveClass(styles['text-large']);
      expect(element).toHaveClass(styles['text-weight-bold']);
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
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Text ref={ref}>Ref text</Text>);

      expect(ref).toHaveBeenCalled();
    });

    it('provides access to DOM element via ref', () => {
      const ref = { current: null as HTMLSpanElement | null };
      render(<Text ref={ref}>Ref accessible text</Text>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Ref accessible text');
    });

    it('forwards ref to different element types', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(
        <Text as='div' ref={ref}>
          Div ref text
        </Text>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Div ref text');
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(Text.displayName).toBe('Text');
    });
  });

  describe('Complex Combinations', () => {
    it('handles multiple props combinations', () => {
      const { container } = render(
        <Text
          variant='accent'
          size={6}
          weight={700}
          transform='uppercase'
          align='center'
          lineClamp={2}
          underline
          italic
          as='p'
          className='complex-text'
        >
          Complex styled text
        </Text>
      );

      const text = container.firstChild;
      expect(text).toHaveClass(styles['text-accent']);
      expect(text).toHaveClass(styles['text-6']);
      expect(text).toHaveClass(styles['text-weight-700']);
      expect(text).toHaveClass(styles['text-transform-uppercase']);
      expect(text).toHaveClass(styles['text-align-center']);
      expect(text).toHaveClass(styles['text-line-clamp']);
      expect(text).toHaveClass(styles['text-line-clamp-2']);
      expect(text).toHaveClass(styles['text-underline']);
      expect(text).toHaveClass(styles['text-italic']);
      expect(text).toHaveClass('complex-text');
      expect(text.tagName.toLowerCase()).toBe('p');
    });

    it('handles all style modifiers together', () => {
      const { container } = render(
        <Text underline strikeThrough italic>
          All modifiers
        </Text>
      );

      const text = container.firstChild;
      expect(text).toHaveClass(styles['text-underline']);
      expect(text).toHaveClass(styles['text-strike-through']);
      expect(text).toHaveClass(styles['text-italic']);
      expect(text).toHaveClass(styles['text-italic-strike-through']);
    });
  });

  describe('Edge Cases', () => {
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

  describe('Accessibility', () => {
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

    it('works with screen readers', () => {
      render(
        <Text as='label' htmlFor='input-field'>
          Screen reader accessible label
        </Text>
      );

      const label = screen.getByText('Screen reader accessible label');
      expect(label).toHaveAttribute('for', 'input-field');
    });
  });
});
