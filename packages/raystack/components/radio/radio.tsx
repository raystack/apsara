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
    size: {
      small: styles['group-small'],
      large: styles['group-large']
    }
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'large'
  }
});

const radioVariants = cva(styles.radioitem, {
  variants: {
    size: {
      small: styles.small,
      large: styles.large
    }
  }
});

interface RadioGroupProps
  extends RadioGroupPrimitive.Props,
    Omit<VariantProps<typeof radioGroupVariants>, 'orientation'> {
  orientation?: 'vertical' | 'horizontal';
}

function RadioGroup({
  className,
  orientation = 'vertical',
  size,
  required,
  ...props
}: RadioGroupProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <RadioGroupPrimitive
      aria-orientation={orientation}
      className={radioGroupVariants({ orientation, size, className })}
      required={resolvedRequired}
      {...props}
    />
  );
}

RadioGroup.displayName = 'Radio.Group';

interface RadioItemProps
  extends RadioPrimitive.Root.Props,
    VariantProps<typeof radioVariants> {}

function RadioItem({ className, size, ...props }: RadioItemProps) {
  return (
    <RadioPrimitive.Root
      {...props}
      className={radioVariants({ size, className })}
    >
      <RadioPrimitive.Indicator className={styles.indicator} />
    </RadioPrimitive.Root>
  );
}

RadioItem.displayName = 'Radio';

export const Radio = Object.assign(RadioItem, {
  Group: RadioGroup
});
