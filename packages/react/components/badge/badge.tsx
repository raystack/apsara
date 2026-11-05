import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import { radiusVariants } from '../../shared/radius';
import styles from './badge.module.css';

const badge = cva(styles['badge'], {
  variants: {
    ...radiusVariants,
    color: {
      accent: styles['badge-accent'],
      attention: styles['badge-attention'],
      danger: styles['badge-danger'],
      success: styles['badge-success'],
      neutral: styles['badge-neutral'],
      gradient: styles['badge-gradient']
    },
    size: {
      micro: styles['badge-micro'],
      small: styles['badge-small'],
      regular: styles['badge-regular']
    }
  },
  defaultVariants: {
    color: 'accent',
    size: 'small'
  }
});

export type BadgeProps = VariantProps<typeof badge> &
  ComponentProps<'span'> & {
    icon?: ReactNode;
    screenReaderText?: string;
  };

export const Badge = ({
  color,
  size,
  radius,
  icon,
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
      {icon && (
        <span className={styles['icon']} data-slot='badge-icon'>
          {icon}
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
