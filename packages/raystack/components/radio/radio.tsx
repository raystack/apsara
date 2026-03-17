import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cx } from 'class-variance-authority';

import styles from './radio.module.css';

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive className={cx(styles.radio, className)} {...props} />
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
