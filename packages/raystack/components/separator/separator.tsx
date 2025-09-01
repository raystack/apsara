import { cva } from 'class-variance-authority';
import { Separator as SeparatorPrimitive } from 'radix-ui';

import styles from './separator.module.css';

const separator = cva(styles.separator, {
  variants: {
    size: {
      small: styles['separator-small'],
      half: styles['separator-half'],
      full: styles['separator-full']
    },
    color: {
      primary: styles['separator-primary'],
      secondary: styles['separator-secondary'],
      tertiary: styles['separator-tertiary']
    }
  },
  defaultVariants: {
    size: 'full',
    color: 'primary'
  }
});

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'half' | 'full';
  color?: 'primary' | 'secondary' | 'tertiary';
  'aria-label'?: string;
}

export function Separator({
  className,
  orientation = 'horizontal',
  size,
  color,
  'aria-label': ariaLabel,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative
      orientation={orientation}
      className={separator({ size, color, className })}
      aria-orientation={orientation}
      aria-label={ariaLabel || `${orientation} separator`}
      role='separator'
      {...props}
    />
  );
}

Separator.displayName = 'Separator';
