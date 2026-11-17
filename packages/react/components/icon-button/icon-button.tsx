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
  /**
   * Size of the button.
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Shows a spinner in place of the icon and blocks clicks. The button stays focusable.
   * @default false
   */
  loading?: boolean;
  /** Whether the button renders a native `<button>`. Defaults to `false` when `render` is set, otherwise `true`. */
  nativeButton?: boolean;
  /** Whether the button stays focusable while disabled. Defaults to `true` while `loading`, otherwise `false`. */
  focusableWhenDisabled?: boolean;
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
            color='inherit'
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
