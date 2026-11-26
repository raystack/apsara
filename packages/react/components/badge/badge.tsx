import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import { radiusVariants } from '../../shared/radius';
import styles from './badge.module.css';

const badge = cva(styles['badge'], {
  variants: {
    ...radiusVariants,
    /** Color of the badge. */
    color: {
      accent: styles['badge-accent'],
      attention: styles['badge-attention'],
      danger: styles['badge-danger'],
      success: styles['badge-success'],
      neutral: styles['badge-neutral'],
      gradient: styles['badge-gradient']
    },
    /** Size of the badge. */
    size: {
      mini: styles['badge-mini'],
      small: styles['badge-small'],
      medium: styles['badge-medium']
    }
  },
  defaultVariants: {
    color: 'accent',
    size: 'small'
  }
});

export type BadgeProps = VariantProps<typeof badge> &
  ComponentProps<'span'> & {
    /** Icon shown before the text. */
    leadingIcon?: ReactNode;
    /** Extra text that only screen readers announce. */
    screenReaderText?: string;
  };

export const Badge = ({
  color,
  size,
  radius,
  leadingIcon,
  children,
  className,
  screenReaderText,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={badge({ color, size, radius, className })}
      data-slot='badge'
      {...props}
    >
      {leadingIcon && (
        <span className={styles['icon']} data-slot='badge-leading-icon'>
          {leadingIcon}
        </span>
      )}
      {screenReaderText && (
        <span
          className={styles['sr-only']}
          data-slot='badge-screen-reader-text'
        >
          {screenReaderText}
        </span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
