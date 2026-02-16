'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, SVGAttributes } from 'react';
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

export interface SelectTriggerProps extends VariantProps<typeof trigger> {
  iconProps?: IconProps;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  disabled?: boolean;
}

export const SelectTrigger = forwardRef<HTMLElement, SelectTriggerProps>(
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
    const { mode, multiple, triggerRef } = useSelectContext();

    const triggerClassName = trigger({ size, variant, className });
    const icon = (
      <ChevronDownIcon
        className={styles.triggerIcon}
        aria-hidden='true'
        {...iconProps}
      />
    );

    const content = (
      <Flex className={styles.triggerContent} align='center' gap={2}>
        {children}
      </Flex>
    );

    if (mode === 'combobox') {
      return (
        <ComboboxPrimitive.Trigger
          ref={(node: HTMLElement | null) => {
            (triggerRef as React.MutableRefObject<HTMLElement | null>).current =
              node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          data-multiselectable={multiple ? true : undefined}
          className={triggerClassName}
          aria-label={ariaLabel || 'Select option'}
          {...props}
        >
          {content}
          {icon}
        </ComboboxPrimitive.Trigger>
      );
    }

    return (
      <SelectPrimitive.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        data-multiselectable={multiple ? true : undefined}
        className={triggerClassName}
        aria-label={ariaLabel || 'Select option'}
        {...props}
      >
        {content}
        {icon}
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = 'Select.Trigger';
