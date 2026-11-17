import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { useFieldContext } from '../field';

import styles from './radio.module.css';

const radioGroupVariants = cva(styles.group, {
  variants: {
    orientation: {
      vertical: '',
      horizontal: styles['group-horizontal']
    },
    /** Size of the radios in the group. A `size` on `Radio` overrides it. */
    size: {
      small: styles['group-small'],
      medium: styles['group-medium']
    }
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'medium'
  }
});

const radioVariants = cva(styles.radioitem, {
  variants: {
    /** Size of the radio. Defaults to the `size` of `Radio.Group`. */
    size: {
      small: styles.small,
      medium: styles.medium
    }
  }
});

export interface RadioGroupProps<Value = string>
  extends RadioGroupPrimitive.Props<Value>,
    Omit<VariantProps<typeof radioGroupVariants>, 'orientation'> {
  /**
   * Layout direction of the radio group.
   * @default "vertical"
   */
  orientation?: 'vertical' | 'horizontal';
}

function RadioGroup<Value = string>({
  className,
  orientation = 'vertical',
  size,
  required,
  ...props
}: RadioGroupProps<Value>) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <RadioGroupPrimitive<Value>
      aria-orientation={orientation}
      className={radioGroupVariants({ orientation, size, className })}
      required={resolvedRequired}
      data-slot='radio-group'
      {...props}
    />
  );
}

RadioGroup.displayName = 'Radio.Group';

export interface RadioItemProps
  extends RadioPrimitive.Root.Props,
    VariantProps<typeof radioVariants> {}

function RadioItem({ className, size, ...props }: RadioItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot='radio'
      {...props}
      className={radioVariants({ size, className })}
    >
      <RadioPrimitive.Indicator
        className={styles.indicator}
        data-slot='radio-indicator'
        keepMounted
      />
    </RadioPrimitive.Root>
  );
}

RadioItem.displayName = 'Radio';

export const Radio = Object.assign(RadioItem, {
  Group: RadioGroup
});
