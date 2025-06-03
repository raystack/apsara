import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { ElementRef, SVGAttributes, forwardRef } from 'react';
import { Flex } from '../flex';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

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
  extends SelectPrimitive.SelectTriggerProps,
    VariantProps<typeof trigger> {
  iconProps?: IconProps;
}

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      size,
      variant,
      className,
      children,
      iconProps = {},
      asChild,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { multiple, autocomplete } = useSelectContext();
    return (
      <SelectPrimitive.Trigger
        data-multiselectable={multiple ? true : undefined}
        ref={ref}
        className={trigger({ size, variant, className })}
        aria-label={ariaLabel || 'Select option'}
        aria-haspopup={autocomplete ? 'dialog' : 'listbox'}
        {...props}
      >
        <Flex className={styles.triggerContent} align='center' gap={2}>
          {asChild ? <Slot>{children}</Slot> : children}
        </Flex>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon
            className={styles.triggerIcon}
            aria-hidden='true'
            {...iconProps}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
