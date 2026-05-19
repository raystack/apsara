import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva, type VariantProps } from 'class-variance-authority';

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

type SeparatorProps = SeparatorPrimitive.Props &
  VariantProps<typeof separator> & {
    /**
     * When true, the separator is purely decorative and hidden from
     * assistive technology. Use for visual dividers that don't convey
     * structure.
     * @default false
     */
    decorative?: boolean;
  };

export function Separator({
  className,
  orientation = 'horizontal',
  size,
  color,
  decorative,
  ...props
}: SeparatorProps) {
  const decorativeProps = decorative
    ? {
        role: 'presentation',
        'aria-hidden': true,
        'aria-orientation': undefined
      }
    : {};
  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={separator({ size, color, className })}
      {...decorativeProps}
      {...props}
    />
  );
}

Separator.displayName = 'Separator';
