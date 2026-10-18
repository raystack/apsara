'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { ChevronDownIcon, XIcon } from '~/icons';
import chipStyles from '../chip/chip.module.css';
import { Input } from '../input';
import { InputFrame, inputFieldClassName } from '../input/input';
import inputStyles from '../input/input.module.css';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

const MAX_CHIPS_VISIBLE = 2;

export interface ComboboxInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'trailingIcon' | 'suffix' | 'chips' | 'maxChipsVisible'
  > {}

export const ComboboxInput = ({ ref, ...props }: ComboboxInputProps) => {
  const { multiple, inputContainerRef } = useComboboxContext();

  if (multiple) return <ComboboxChipsInput ref={ref} {...props} />;

  return (
    <ComboboxPrimitive.Input
      ref={ref}
      render={
        <Input
          containerRef={inputContainerRef}
          trailingIcon={<ChevronDownIcon />}
          data-slot='combobox-input'
          {...props}
        />
      }
    />
  );
};
ComboboxInput.displayName = 'Combobox.Input';

const chipClassName = cx(
  chipStyles.chip,
  chipStyles['chip-variant-outline'],
  chipStyles['chip-size-small'],
  chipStyles['chip-color-neutral'],
  inputStyles.chip,
  styles.chip
);

function ComboboxChipsInput({
  ref,
  className,
  disabled,
  placeholder,
  leadingIcon,
  prefix,
  size,
  radius,
  variant = 'default',
  classNames,
  onKeyDown,
  ...props
}: ComboboxInputProps) {
  const { inputContainerRef, value, onValueChange, getLabel } =
    useComboboxContext();
  const values = Array.isArray(value) ? value : [];
  const visibleValues = values.slice(0, MAX_CHIPS_VISIBLE);
  const hiddenCount = values.length - visibleValues.length;
  const trailingIcon = <ChevronDownIcon />;

  return (
    <InputFrame
      disabled={disabled}
      hasChips={values.length > 0}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      prefix={prefix}
      size={size}
      radius={radius}
      variant={variant}
      containerRef={inputContainerRef}
      className={classNames?.container}
    >
      <ComboboxPrimitive.Chips
        className={inputStyles['chip-input-container']}
        data-slot='combobox-chips'
      >
        {visibleValues.map(val => {
          const label = getLabel(val);
          return (
            <ComboboxPrimitive.Chip
              key={String(val)}
              className={chipClassName}
              aria-label={label}
              data-slot='combobox-chip'
            >
              {label}
              {!disabled && (
                <ComboboxPrimitive.ChipRemove
                  className={chipStyles['dismiss-button']}
                  aria-label={`Remove ${label}`}
                  data-slot='combobox-chip-remove'
                >
                  <XIcon width={12} height={12} aria-hidden='true' />
                </ComboboxPrimitive.ChipRemove>
              )}
            </ComboboxPrimitive.Chip>
          );
        })}
        {hiddenCount > 0 && (
          <span
            className={inputStyles['chip-overflow']}
            data-slot='combobox-chip-overflow'
          >
            +{hiddenCount}
          </span>
        )}
        <ComboboxPrimitive.Input
          ref={ref}
          className={state =>
            inputFieldClassName({
              leadingIcon,
              trailingIcon,
              prefix,
              className:
                typeof className === 'function' ? className(state) : className
            })
          }
          placeholder={values.length > 0 ? undefined : placeholder}
          disabled={disabled}
          data-slot='combobox-input'
          onKeyDown={event => {
            onKeyDown?.(event);
            // Base UI removes the last rendered chip on Backspace. When chips
            // are hidden behind "+N", that is not the last value.
            if (
              event.key === 'Backspace' &&
              hiddenCount > 0 &&
              event.currentTarget.value === '' &&
              !event.baseUIHandlerPrevented
            ) {
              event.preventBaseUIHandler();
              onValueChange?.(values.slice(0, -1));
            }
          }}
          {...props}
        />
      </ComboboxPrimitive.Chips>
    </InputFrame>
  );
}
