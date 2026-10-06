'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { useRef } from 'react';
import { useFieldContext } from '../field';

import styles from './checkbox.module.css';

const CheckMarkIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    className={styles.icon}
    data-slot='checkbox-icon'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.9005 4.9671C12.0894 4.6782 12.0083 4.29086 11.7194 4.10197C11.4305 3.91307 11.0432 3.99414 10.8543 4.28304L7.15577 9.93961L5.04542 8.02112C4.79001 7.78893 4.39473 7.80775 4.16254 8.06316C3.93035 8.31857 3.94917 8.71385 4.20458 8.94605L6.85731 11.3576C6.99274 11.4807 7.17532 11.5383 7.35686 11.5151C7.53841 11.492 7.70068 11.3904 7.80084 11.2372L11.9005 4.9671Z'
      fill='currentColor'
    />
  </svg>
);

const IndeterminateIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    className={styles.icon}
    data-slot='checkbox-icon'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.5 8.5H4.5C4.22386 8.5 4 8.27614 4 8C4 7.72386 4.22386 7.5 4.5 7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5Z'
      fill='currentColor'
    />
  </svg>
);

const checkboxVariants = cva(styles.checkbox, {
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

interface CheckboxGroupProps extends CheckboxGroupPrimitive.Props {
  /** Layout direction of the checkbox group.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

function CheckboxGroup({
  className,
  orientation = 'vertical',
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      className={cx(
        styles.group,
        orientation === 'horizontal' && styles['group-horizontal'],
        className
      )}
      data-slot='checkbox-group'
      {...props}
    />
  );
}

CheckboxGroup.displayName = 'Checkbox.Group';

interface CheckboxItemProps
  extends CheckboxPrimitive.Root.Props,
    VariantProps<typeof checkboxVariants> {}

function CheckboxItem({
  className,
  required,
  size,
  render,
  ...props
}: CheckboxItemProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;
  // Remember which icon is showing while the indicator is up. During the exit
  // (transitionStatus 'ending') Base UI has already flipped checked/
  // indeterminate to the new value, so reading it live would flash the
  // checkmark for a frame on an indeterminate → unchecked change. Render the
  // remembered icon during the exit instead.
  const shownIconRef = useRef<'check' | 'indeterminate'>('check');

  return (
    <CheckboxPrimitive.Root
      className={checkboxVariants({ size, className })}
      required={resolvedRequired}
      data-slot='checkbox'
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={styles.indicator}
        keepMounted
        render={
          render ??
          ((props, state) => {
            const isEnding = state.transitionStatus === 'ending';
            if (!isEnding) {
              shownIconRef.current = state.indeterminate
                ? 'indeterminate'
                : 'check';
            }
            const showIcon = state.checked || state.indeterminate || isEnding;
            const icon = isEnding
              ? shownIconRef.current
              : state.indeterminate
                ? 'indeterminate'
                : 'check';
            return (
              <span data-slot='checkbox-indicator' {...props}>
                {showIcon &&
                  (icon === 'indeterminate' ? (
                    <IndeterminateIcon />
                  ) : (
                    <CheckMarkIcon />
                  ))}
              </span>
            );
          })
        }
      />
    </CheckboxPrimitive.Root>
  );
}

CheckboxItem.displayName = 'Checkbox';

export const Checkbox = Object.assign(CheckboxItem, {
  Group: CheckboxGroup
});
