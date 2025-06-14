import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  forwardRef
} from 'react';

import { Spinner } from '../spinner';
import styles from './button.module.css';

const button = cva(styles['button'], {
  variants: {
    variant: {
      solid: styles['button-solid'],
      outline: styles['button-outline'],
      ghost: styles['button-ghost'],
      text: styles['button-text']
    },
    size: {
      small: styles['button-small'],
      normal: styles['button-normal']
    },
    disabled: {
      true: styles['button-disabled']
    },
    loading: {
      true: styles['button-loading']
    },
    color: {
      accent: styles['button-color-accent'],
      danger: styles['button-color-danger'],
      neutral: styles['button-color-neutral'],
      success: styles['button-color-success']
    }
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'accent',
      className: styles['button-solid-accent']
    },
    {
      variant: 'solid',
      color: 'danger',
      className: styles['button-solid-danger']
    },
    {
      variant: 'solid',
      color: 'neutral',
      className: styles['button-solid-neutral']
    },
    {
      variant: 'solid',
      color: 'success',
      className: styles['button-solid-success']
    },
    {
      variant: 'outline',
      color: 'accent',
      className: styles['button-outline-accent']
    },
    {
      variant: 'outline',
      color: 'danger',
      className: styles['button-outline-danger']
    },
    {
      variant: 'outline',
      color: 'neutral',
      className: styles['button-outline-neutral']
    },
    {
      variant: 'outline',
      color: 'success',
      className: styles['button-outline-success']
    }
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'normal',
    color: 'accent'
  }
});

const getLoaderOnlyClass = (size: 'small' | 'normal' | null) =>
  size === 'small'
    ? styles['loader-only-button-small']
    : styles['loader-only-button-normal'];

export type ButtonProps = PropsWithChildren<VariantProps<typeof button>> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    loading?: boolean;
    loaderText?: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    maxWidth?: string | number;
    width?: string | number;
    style?: React.CSSProperties;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      color = 'accent',
      size = 'normal',
      asChild = false,
      disabled,
      loading,
      loaderText,
      leadingIcon,
      trailingIcon,
      maxWidth,
      width,
      style = {},
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isLoaderOnly = loading && !loaderText;
    const widthStyle = { maxWidth, width };
    const buttonStyle = { ...widthStyle, ...style };

    return (
      <Comp
        className={`${button({ variant, size, color, disabled, loading, className })} ${isLoaderOnly ? getLoaderOnlyClass(size) : ''}`}
        ref={ref}
        disabled={disabled}
        style={buttonStyle}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={1} color='default' />
            {loaderText && (
              <span className={styles['loader-text']}>{loaderText}</span>
            )}
          </>
        ) : (
          <>
            {leadingIcon && (
              <span className={`${styles['icon']} ${styles['icon-leading']}`}>
                {leadingIcon}
              </span>
            )}
            {children}
            {trailingIcon && (
              <span className={`${styles['icon']} ${styles['icon-trailing']}`}>
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
