'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  Children,
  ComponentProps,
  createContext,
  isValidElement,
  ReactNode,
  useContext
} from 'react';
import { XIcon } from '~/icons';
import { radiusVariants } from '../../shared/radius';
import styles from './chip.module.css';

const chip = cva(styles.chip, {
  variants: {
    ...radiusVariants,
    variant: {
      outline: styles['chip-variant-outline'],
      filled: styles['chip-variant-filled']
    },
    size: {
      large: styles['chip-size-large'],
      small: styles['chip-size-small']
    },
    color: {
      neutral: styles['chip-color-neutral'],
      accent: styles['chip-color-accent'],
      danger: styles['chip-color-danger'],
      success: styles['chip-color-success'],
      warning: styles['chip-color-warning']
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'small',
    color: 'neutral'
  }
});

const ChipContext = createContext<{ label?: string; disabled?: boolean }>({});

export type ChipProps = useRender.ComponentProps<'span'> &
  VariantProps<typeof chip> & {
    trailingIcon?: ReactNode;
    leadingIcon?: ReactNode;
    disabled?: boolean;
  };

export type ChipRemoveProps = useRender.ComponentProps<'button'>;

function getTextLabel(children: ReactNode) {
  const text = Children.toArray(children)
    .filter(child => typeof child === 'string' || typeof child === 'number')
    .join('')
    .trim();
  return text || undefined;
}

const ChipRoot = ({
  variant,
  radius,
  size,
  color,
  trailingIcon,
  leadingIcon,
  children,
  className,
  onClick,
  role,
  disabled,
  'aria-label': ariaLabel,
  render,
  ref,
  ...props
}: ChipProps) => {
  const label = ariaLabel ?? getTextLabel(children);
  // A chip with a remove button stays a span, so the buttons do not nest.
  const hasRemove = Children.toArray(children).some(
    child => isValidElement(child) && child.type === ChipRemove
  );
  const isInteractive = !!onClick && !hasRemove;

  const sharedProps = {
    'aria-label': label,
    'data-disabled': disabled || undefined
  };

  const content = (
    <>
      {leadingIcon && (
        <span
          className={styles['leading-icon']}
          aria-hidden='true'
          role='presentation'
          data-slot='chip-leading-icon'
        >
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span
          className={styles['trailing-icon']}
          aria-hidden='true'
          role='presentation'
          data-slot='chip-trailing-icon'
        >
          {trailingIcon}
        </span>
      )}
    </>
  );

  const ownProps = isInteractive
    ? {
        type: 'button',
        disabled,
        role,
        className: chip({
          variant,
          radius,
          size,
          color,
          className: cx(styles['chip-interactive'], className)
        }),
        onClick
      }
    : {
        className: chip({ variant, size, color, radius, className }),
        role: role ?? 'status',
        onClick: disabled ? undefined : onClick
      };

  const element = useRender({
    defaultTagName: isInteractive ? 'button' : 'span',
    render,
    ref,
    props: mergeProps<'span'>(
      { 'data-slot': 'chip' } as useRender.ComponentProps<'span'>,
      props,
      {
        ...sharedProps,
        ...(ownProps as ComponentProps<'span'>),
        children: content
      }
    )
  });

  return <ChipContext value={{ label, disabled }}>{element}</ChipContext>;
};
ChipRoot.displayName = 'Chip';

const ChipRemove = ({ render, ref, ...props }: ChipRemoveProps) => {
  const { label, disabled } = useContext(ChipContext);

  return useRender({
    defaultTagName: 'button',
    render,
    ref,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: styles.remove,
        'aria-label': `Remove ${label ?? 'item'}`,
        disabled: disabled || undefined,
        'data-slot': 'chip-remove',
        onClick: event => event.stopPropagation(),
        children: (
          <XIcon
            width={12}
            height={12}
            aria-hidden='true'
            role='presentation'
            data-slot='chip-remove-icon'
          />
        )
      } as useRender.ComponentProps<'button'>,
      props
    )
  });
};
ChipRemove.displayName = 'Chip.Remove';

export const Chip = Object.assign(ChipRoot, { Remove: ChipRemove });
