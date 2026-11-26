'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  AriaRole,
  Children,
  ComponentProps,
  createContext,
  isValidElement,
  MouseEventHandler,
  ReactNode,
  useContext
} from 'react';
import { XIcon } from '~/icons';
import { radiusVariants } from '../../shared/radius';
import styles from './chip.module.css';

const chip = cva(styles.chip, {
  variants: {
    ...radiusVariants,
    /** Visual style of the chip. */
    variant: {
      outline: styles['chip-variant-outline'],
      solid: styles['chip-variant-solid']
    },
    /** Size of the chip. */
    size: {
      mini: styles['chip-size-mini'],
      small: styles['chip-size-small']
    },
    /** Color of the chip. `danger`, `success` and `attention` show a status. */
    color: {
      neutral: styles['chip-color-neutral'],
      accent: styles['chip-color-accent'],
      danger: styles['chip-color-danger'],
      success: styles['chip-color-success'],
      attention: styles['chip-color-attention']
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'mini',
    color: 'neutral'
  }
});

const ChipContext = createContext<{ label?: string; disabled?: boolean }>({});

export type ChipProps = useRender.ComponentProps<'span'> &
  VariantProps<typeof chip> & {
    /** Icon shown after the label. */
    trailingIcon?: ReactNode;
    /** Icon shown before the label. */
    leadingIcon?: ReactNode;
    /**
     * Whether the chip is disabled. A disabled chip ignores pointer clicks.
     * @default false
     */
    disabled?: boolean;
    /** ARIA role of the chip. Defaults to `"status"`, unless the chip renders a button. */
    role?: AriaRole;
    /** Accessible name of the chip. Defaults to the text in `children`. */
    'aria-label'?: string;
  };

export type ChipRemoveProps = useRender.ComponentProps<'button'> & {
  /** Called when the button is clicked. The click does not reach the chip. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the button. Defaults to `"Remove"` plus the chip label. */
  'aria-label'?: string;
  /** Content of the button. Defaults to an X icon. */
  children?: ReactNode;
};

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
