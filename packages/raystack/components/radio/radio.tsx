import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cx } from 'class-variance-authority';
import { forwardRef } from 'react';

import styles from './radio.module.css';

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupPrimitive.Props>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive
      ref={ref}
      className={cx(styles.radio, className)}
      {...props}
    />
  )
);

RadioGroup.displayName = 'Radio.Group';

const RadioItem = forwardRef<HTMLButtonElement, RadioPrimitive.Root.Props>(
  ({ className, ...props }, forwardedRef) => (
    <RadioPrimitive.Root
      {...props}
      ref={forwardedRef}
      className={cx(styles.radioitem, className)}
    >
      <RadioPrimitive.Indicator className={styles.indicator} />
    </RadioPrimitive.Root>
  )
);

RadioItem.displayName = 'Radio';

export const Radio = Object.assign(RadioItem, {
  Group: RadioGroup
});
