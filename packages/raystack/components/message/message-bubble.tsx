'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Text } from '../text/text';
import styles from './message.module.css';

const bubble = cva(styles.bubble, {
  variants: {
    variant: {
      solid: styles['bubble-solid'],
      outline: styles['bubble-outline'],
      ghost: styles['bubble-ghost']
    },
    color: {
      accent: styles['bubble-accent'],
      neutral: styles['bubble-neutral'],
      danger: styles['bubble-danger']
    }
  },
  defaultVariants: {
    variant: 'solid',
    color: 'neutral'
  }
});

const GHOST_TEXT_VARIANT = {
  neutral: 'primary',
  accent: 'accent',
  danger: 'danger'
} as const;

export interface MessageBubbleProps
  extends ComponentProps<'p'>,
    VariantProps<typeof bubble> {
  /**
   * Visual style of the message surface. `"ghost"` drops the surface
   * entirely — no background, border or padding — and renders the message as
   * full-width body copy.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'outline' | 'ghost';
  /**
   * Color of the message surface.
   * @defaultValue "neutral"
   */
  color?: 'accent' | 'neutral' | 'danger';
}

export function MessageBubble({
  className,
  variant = 'solid',
  color = 'neutral',
  ref,
  ...props
}: MessageBubbleProps) {
  const bubbleProps = {
    'data-slot': 'message-bubble',
    'data-variant': variant,
    'data-color': color,
    className: bubble({ variant, color, className }),
    ...props
  };

  // A ghost bubble has no surface, so it is plain body copy and takes its
  // typography from Text. The others carry their own on the surface classes.
  if (variant === 'ghost') {
    return (
      <Text
        render={<p ref={ref} />}
        size='small'
        variant={GHOST_TEXT_VARIANT[color]}
        {...bubbleProps}
      />
    );
  }

  return <p ref={ref} {...bubbleProps} />;
}

MessageBubble.displayName = 'Message.Bubble';
