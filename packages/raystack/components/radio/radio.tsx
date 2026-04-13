import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cx } from 'class-variance-authority';
import { useFieldContext } from '../field';

import styles from './radio.module.css';

function RadioGroup({
  className,
  required,
  ...props
}: RadioGroupPrimitive.Props) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <RadioGroupPrimitive
      className={cx(styles.radio, className)}
      required={resolvedRequired}
      {...props}
    />
  );
}

RadioGroup.displayName = 'Radio.Group';

function RadioItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root {...props} className={cx(styles.radioitem, className)}>
      <RadioPrimitive.Indicator className={styles.indicator} />
    </RadioPrimitive.Root>
  );
}

RadioItem.displayName = 'Radio';

export const Radio = Object.assign(RadioItem, {
  Group: RadioGroup
});
