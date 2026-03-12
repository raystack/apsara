'use client';

import { NumberField as NumberFieldPrimitive } from '@base-ui/react';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import {
  createContext,
  ElementRef,
  forwardRef,
  type ReactNode,
  useContext,
  useId
} from 'react';
import { Label } from '../label';
import styles from './number-field.module.css';

const NumberFieldContext = createContext<{ fieldId: string } | null>(null);

const NumberFieldRoot = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.Root>,
  NumberFieldPrimitive.Root.Props & { children?: ReactNode }
>(({ className, children, id, ...props }, ref) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <NumberFieldContext.Provider value={{ fieldId }}>
      <NumberFieldPrimitive.Root
        ref={ref}
        className={cx(styles.root, className)}
        id={fieldId}
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
    </NumberFieldContext.Provider>
  );
});
NumberFieldRoot.displayName = 'NumberField';

const NumberFieldGroup = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.Group>,
  NumberFieldPrimitive.Group.Props
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Group
    ref={ref}
    className={cx(styles.group, className)}
    {...props}
  />
));
NumberFieldGroup.displayName = 'NumberField.Group';

const NumberFieldInput = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.Input>,
  NumberFieldPrimitive.Input.Props
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Input
    ref={ref}
    className={cx(styles.input, className)}
    {...props}
  />
));
NumberFieldInput.displayName = 'NumberField.Input';

const NumberFieldDecrement = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.Decrement>,
  NumberFieldPrimitive.Decrement.Props
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Decrement
    ref={ref}
    className={cx(styles.decrement, className)}
    {...props}
  >
    {children ?? <MinusIcon width={12} height={12} />}
  </NumberFieldPrimitive.Decrement>
));
NumberFieldDecrement.displayName = 'NumberField.Decrement';

const NumberFieldIncrement = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.Increment>,
  NumberFieldPrimitive.Increment.Props
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Increment
    ref={ref}
    className={cx(styles.increment, className)}
    {...props}
  >
    {children ?? <PlusIcon width={12} height={12} />}
  </NumberFieldPrimitive.Increment>
));
NumberFieldIncrement.displayName = 'NumberField.Increment';

export interface NumberFieldScrubAreaProps
  extends NumberFieldPrimitive.ScrubArea.Props {
  label: string;
}

const NumberFieldScrubArea = forwardRef<
  ElementRef<typeof NumberFieldPrimitive.ScrubArea>,
  NumberFieldScrubAreaProps
>(({ className, label, ...props }, ref) => {
  const context = useContext(NumberFieldContext);

  return (
    <NumberFieldPrimitive.ScrubArea
      ref={ref}
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
});
NumberFieldScrubArea.displayName = 'NumberField.ScrubArea';

function CursorGrowIcon(props: React.ComponentProps<'svg'>) {
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
