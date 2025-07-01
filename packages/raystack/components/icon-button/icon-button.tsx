import { VariantProps, cva } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButton> {
  size?: 1 | 2 | 3 | 4;
  'aria-label'?: string;
}

export const IconButton = forwardRef<ElementRef<'button'>, IconButtonProps>(
  (
    {
      className,
      size,
      disabled,
      children,
      'aria-label': ariaLabel,
      style,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={iconButton({ size, className })}
      disabled={disabled}
      type='button'
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={style}
      {...props}
    >
      <Flex aria-hidden='true' align='center' justify='center'>
        {children}
      </Flex>
    </button>
  )
);

IconButton.displayName = 'IconButton';
