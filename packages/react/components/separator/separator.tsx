import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva, type VariantProps } from 'class-variance-authority';

import styles from './separator.module.css';

const separator = cva(styles.separator, {
  variants: {
    /** Length of the line. `full` runs edge to edge, `middle` insets both ends. */
    variant: {
      full: styles['variant-full'],
      middle: styles['variant-middle']
    },
    /** Color of the separator. */
    color: {
      primary: styles['separator-primary'],
      secondary: styles['separator-secondary'],
      tertiary: styles['separator-tertiary'],
      emphasis: styles['separator-emphasis'],
      accent: styles['separator-accent'],
      attention: styles['separator-attention'],
      danger: styles['separator-danger'],
      success: styles['separator-success']
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
     * Whether the separator is decorative. A decorative separator has `role="presentation"` and `aria-hidden`.
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
