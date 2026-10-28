import { Button as ButtonPrimitive } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { radiusVariants } from '../../shared/radius';
import { Flex } from '../flex';
import { Spinner } from '../spinner';
import styles from './icon-button.module.css';

const iconButton = cva(styles.iconButton, {
  variants: {
    ...radiusVariants,
    size: {
      1: styles['iconButton-size-1'],
      2: styles['iconButton-size-2'],
      3: styles['iconButton-size-3'],
      4: styles['iconButton-size-4']
    }
  },
  defaultVariants: {
    size: 2
  }
});

export interface IconButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof iconButton> {
  size?: 1 | 2 | 3 | 4;
  /**
   * Shows a spinner in place of the icon and blocks clicks.
   * @default false
   */
  loading?: boolean;
  /**
   * Accessible name for the icon-only button. Strongly recommended so
   * screen readers can announce its purpose.
   */
  'aria-label'?: string;
}

export function IconButton({
  className,
  size,
  radius,
  disabled,
  loading,
  children,
  render,
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      className={iconButton({ size, radius, className })}
      disabled={disabled || loading}
      render={render}
      nativeButton={!render}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-slot='icon-button'
      {...props}
    >
      <Flex
        aria-hidden='true'
        align='center'
        justify='center'
        data-slot='icon-button-icon'
      >
        {loading ? (
          <Spinner
            size={1}
            color='default'
            aria-hidden='true'
            data-slot='icon-button-loader'
          />
        ) : (
          children
        )}
      </Flex>
    </ButtonPrimitive>
  );
}

IconButton.displayName = 'IconButton';
