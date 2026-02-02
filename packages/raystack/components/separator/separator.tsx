import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva } from 'class-variance-authority';

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

interface SeparatorProps extends SeparatorPrimitive.Props {
  size?: 'small' | 'half' | 'full';
  color?: 'primary' | 'secondary' | 'tertiary';
}

export function Separator({
  className,
  orientation = 'horizontal',
  size,
  color,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={separator({ size, color, className })}
      {...props}
    />
  );
}

Separator.displayName = 'Separator';
