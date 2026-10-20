import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva, type VariantProps } from 'class-variance-authority';

import styles from './separator.module.css';

const separator = cva(styles.separator, {
  variants: {
    variant: {
      full: styles['variant-full'],
      middle: styles['variant-middle']
    },
    color: {
      primary: styles['separator-primary'],
      secondary: styles['separator-secondary'],
      tertiary: styles['separator-tertiary']
    }
  },
  defaultVariants: {
    variant: 'full',
    color: 'primary'
  }
});

export type SeparatorProps = SeparatorPrimitive.Props &
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
  variant,
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
      data-slot='separator'
      orientation={orientation}
      className={separator({ variant, color, className })}
      {...decorativeProps}
      {...props}
    />
  );
}

Separator.displayName = 'Separator';
