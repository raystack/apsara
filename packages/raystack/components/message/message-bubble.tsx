'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { textVariants } from '../text/text';
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

// A ghost bubble has no surface, so it is plain body copy: it borrows Text's
// small-size typography and colour instead of the surface token pairs below.
const GHOST_TEXT_VARIANT = {
  neutral: 'primary',
  accent: 'accent',
  danger: 'danger'
} as const;

export interface MessageBubbleProps
  extends ComponentProps<'div'>,
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
  ...props
}: MessageBubbleProps) {
  const bubbleClassName = bubble({ variant, color, className });

  return (
    <div
      data-variant={variant}
      data-color={color}
      className={
        variant === 'ghost'
          ? textVariants({
              size: 'small',
              variant: GHOST_TEXT_VARIANT[color],
              // Trails Text's own classes so the ghost resets still win.
              className: bubbleClassName
            })
          : bubbleClassName
      }
      {...props}
    />
  );
}

MessageBubble.displayName = 'Message.Bubble';
