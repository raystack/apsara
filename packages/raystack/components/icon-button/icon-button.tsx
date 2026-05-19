import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './icon-button.module.css';

const iconButton = cva(styles.iconButton, {
  variants: {
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
  extends ComponentProps<'button'>,
    VariantProps<typeof iconButton> {
  size?: 1 | 2 | 3 | 4;
  /**
   * Accessible name for the icon-only button. Strongly recommended so
   * screen readers can announce its purpose.
   */
  'aria-label'?: string;
}

export function IconButton({
  className,
  size,
  disabled,
  children,
  'aria-label': ariaLabel,
  style,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={iconButton({ size, className })}
      disabled={disabled}
      type='button'
      aria-label={ariaLabel}
      style={style}
      {...props}
    >
      <Flex aria-hidden='true' align='center' justify='center'>
        {children}
      </Flex>
    </button>
  );
}

IconButton.displayName = 'IconButton';
