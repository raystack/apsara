'use client';

import { NumberField as NumberFieldPrimitive } from '@base-ui/react';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, createContext, useContext, useId } from 'react';
import { useFieldContext } from '../field';
import { Label } from '../label';
import styles from './number-field.module.css';

const NumberFieldContext = createContext<{ fieldId: string } | null>(null);

function NumberFieldRoot({
  className,
  children,
  id,
  required,
  ...props
}: NumberFieldPrimitive.Root.Props) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <NumberFieldContext value={{ fieldId }}>
      <NumberFieldPrimitive.Root
        className={cx(styles.root, className)}
        id={fieldId}
        required={resolvedRequired}
        {...props}
      >
        {children ?? (
          <NumberFieldPrimitive.Group className={styles.group}>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldPrimitive.Group>
        )}
      </NumberFieldPrimitive.Root>
    </NumberFieldContext>
  );
}
NumberFieldRoot.displayName = 'NumberField';

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      className={cx(styles.group, className)}
      {...props}
    />
  );
}
NumberFieldGroup.displayName = 'NumberField.Group';

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      className={cx(styles.input, className)}
      {...props}
    />
  );
}
NumberFieldInput.displayName = 'NumberField.Input';

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      className={cx(styles.decrement, className)}
      {...props}
    >
      {children ?? <MinusIcon width={12} height={12} />}
    </NumberFieldPrimitive.Decrement>
  );
}
NumberFieldDecrement.displayName = 'NumberField.Decrement';

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      className={cx(styles.increment, className)}
      {...props}
    >
      {children ?? <PlusIcon width={12} height={12} />}
    </NumberFieldPrimitive.Increment>
  );
}
NumberFieldIncrement.displayName = 'NumberField.Increment';

export interface NumberFieldScrubAreaProps
  extends NumberFieldPrimitive.ScrubArea.Props {
  label: string;
}

function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldScrubAreaProps) {
  const context = useContext(NumberFieldContext);

  return (
    <NumberFieldPrimitive.ScrubArea
      className={cx(styles['scrub-area'], className)}
      {...props}
    >
      <Label className={styles['scrub-area-label']} htmlFor={context?.fieldId}>
        {label}
      </Label>
      <NumberFieldPrimitive.ScrubAreaCursor
        className={styles['scrub-area-cursor']}
      >
        <CursorGrowIcon />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  );
}
NumberFieldScrubArea.displayName = 'NumberField.ScrubArea';

function CursorGrowIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden='true'
      fill='black'
      height='14'
      stroke='white'
      viewBox='0 0 24 14'
      width='26'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z' />
    </svg>
  );
}

export const NumberField = Object.assign(NumberFieldRoot, {
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Decrement: NumberFieldDecrement,
  Increment: NumberFieldIncrement,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldPrimitive.ScrubAreaCursor
});
