import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import textStyles from '../../text/text.module.css';
import { Message } from '../message';
import styles from '../message.module.css';

describe('Message', () => {
  it('renders alignment as a data attribute', () => {
    render(
      <Message align='end' data-testid='message'>
        hi
      </Message>
    );
    expect(screen.getByTestId('message')).toHaveAttribute('data-align', 'end');
  });

  it('defaults to start alignment', () => {
    render(<Message data-testid='message'>hi</Message>);
    expect(screen.getByTestId('message')).toHaveAttribute(
      'data-align',
      'start'
    );
  });

  it('renders all sub-parts with their classes', () => {
    render(
      <Message data-testid='message'>
        <Message.Avatar data-testid='avatar'>A</Message.Avatar>
        <Message.Header data-testid='header'>Ana</Message.Header>
        <Message.Content data-testid='content'>body</Message.Content>
        <Message.Footer data-testid='footer'>1:52</Message.Footer>
        <Message.Actions data-testid='actions'>
          <button type='button'>Copy</button>
        </Message.Actions>
      </Message>
    );

    expect(screen.getByTestId('avatar')).toHaveClass(styles['message-avatar']);
    expect(screen.getByTestId('header')).toHaveClass(styles['message-header']);
    expect(screen.getByTestId('content')).toHaveClass(
      styles['message-content']
    );
    expect(screen.getByTestId('footer')).toHaveClass(styles['message-footer']);
    expect(screen.getByTestId('actions')).toHaveClass(
      styles['message-actions']
    );
  });

  it('wraps consecutive messages in a group', () => {
    render(
      <Message.Group data-testid='group'>
        <Message>first</Message>
        <Message>second</Message>
      </Message.Group>
    );
    expect(screen.getByTestId('group')).toHaveClass(styles.group);
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Message ref={ref}>hi</Message>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('Message.Bubble', () => {
    it('defaults to the solid neutral appearance', () => {
      render(<Message.Bubble data-testid='bubble'>text</Message.Bubble>);
      const bubble = screen.getByTestId('bubble');
      expect(bubble).toHaveAttribute('data-variant', 'solid');
      expect(bubble).toHaveAttribute('data-color', 'neutral');
      expect(bubble).toHaveClass(styles['bubble-solid']);
      expect(bubble).toHaveClass(styles['bubble-neutral']);
    });

    it.each([
      ['solid', 'accent'],
      ['solid', 'neutral'],
      ['solid', 'danger'],
      ['outline', 'accent'],
      ['outline', 'neutral'],
      ['outline', 'danger'],
      ['ghost', 'accent'],
      ['ghost', 'neutral'],
      ['ghost', 'danger']
    ] as const)('renders the %s %s appearance', (variant, color) => {
      render(
        <Message.Bubble data-testid='bubble' variant={variant} color={color}>
          text
        </Message.Bubble>
      );
      const bubble = screen.getByTestId('bubble');
      expect(bubble).toHaveAttribute('data-variant', variant);
      expect(bubble).toHaveAttribute('data-color', color);
      expect(bubble).toHaveClass(styles[`bubble-${variant}`]);
      expect(bubble).toHaveClass(styles[`bubble-${color}`]);
    });

    it('renders the ghost variant as small Text', () => {
      render(
        <Message.Bubble data-testid='bubble' variant='ghost'>
          text
        </Message.Bubble>
      );
      const bubble = screen.getByTestId('bubble');
      expect(bubble).toHaveClass(textStyles.text);
      expect(bubble).toHaveClass(textStyles['text-small']);
      expect(bubble).toHaveClass(textStyles['text-primary']);
    });

    it.each([
      ['accent', 'text-accent'],
      ['danger', 'text-danger']
    ] as const)('maps ghost %s onto the %s Text colour', (color, textClass) => {
      render(
        <Message.Bubble data-testid='bubble' variant='ghost' color={color}>
          text
        </Message.Bubble>
      );
      expect(screen.getByTestId('bubble')).toHaveClass(textStyles[textClass]);
    });

    it('leaves the solid variant free of Text classes', () => {
      render(<Message.Bubble data-testid='bubble'>text</Message.Bubble>);
      expect(screen.getByTestId('bubble')).not.toHaveClass(textStyles.text);
    });

    it('keeps a caller className last so it can override the ghost resets', () => {
      render(
        <Message.Bubble data-testid='bubble' variant='ghost' className='custom'>
          text
        </Message.Bubble>
      );
      const bubble = screen.getByTestId('bubble');
      const classes = bubble.className.split(' ');
      expect(classes[classes.length - 1]).toBe('custom');
      expect(classes).toContain(styles['bubble-ghost']);
    });
  });
});
