import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { useFieldContext } from '../field';

import styles from './radio.module.css';

const radioVariants = cva(styles.radioitem, {
  variants: {
    size: {
      small: styles.small,
      large: styles.large
    }
  },
  defaultVariants: {
    size: 'large'
  }
});

interface RadioGroupProps extends RadioGroupPrimitive.Props {
  orientation?: 'vertical' | 'horizontal';
}

function RadioGroup({
  className,
  orientation = 'vertical',
  required,
  ...props
}: RadioGroupProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <RadioGroupPrimitive
      className={cx(
        styles.group,
        orientation === 'horizontal' && styles['group-horizontal'],
        className
      )}
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
