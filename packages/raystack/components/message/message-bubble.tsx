'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './message.module.css';

const bubble = cva(styles.bubble, {
  variants: {
    variant: {
      solid: styles['bubble-solid'],
      outline: styles['bubble-outline']
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

export interface MessageBubbleProps
  extends ComponentProps<'div'>,
    VariantProps<typeof bubble> {
  /**
   * Visual style of the message surface.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'outline';
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
  ...props
}: MessageBubbleProps) {
  return (
    <div
      data-variant={variant}
      data-color={color}
      className={bubble({ variant, color, className })}
      {...props}
    />
  );
}

MessageBubble.displayName = 'Message.Bubble';
