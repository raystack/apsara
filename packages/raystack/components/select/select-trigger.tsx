'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, SVGAttributes } from 'react';
import { Flex } from '../flex';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

const trigger = cva(styles.trigger, {
  variants: {
    size: {
      small: styles['trigger-small'],
      medium: styles['trigger-medium']
    },
    variant: {
      outline: styles['trigger-outline'],
      text: styles['trigger-text']
    }
  },
  defaultVariants: {
    size: 'medium',
    variant: 'outline'
  }
});

export interface SelectTriggerProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof trigger> {
  iconProps?: IconProps;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      size,
      variant,
      className,
      children,
      iconProps = {},
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { multiple, autocomplete } = useSelectContext();

    const TriggerPrimitive = autocomplete
      ? ComboboxPrimitive.Trigger
      : SelectPrimitive.Trigger;

    return (
      <TriggerPrimitive
        data-multiselectable={multiple ? true : undefined}
        ref={ref}
        className={trigger({ size, variant, className })}
        aria-label={ariaLabel || 'Select option'}
        {...props}
      >
        <Flex className={styles.triggerContent} align='center' gap={2}>
          {children}
        </Flex>
        <ChevronDownIcon
          className={styles.triggerIcon}
          aria-hidden='true'
          {...iconProps}
        />
      </TriggerPrimitive>
    );
  }
);
SelectTrigger.displayName = 'Select.Trigger';
