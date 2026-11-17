import { Field as FieldPrimitive } from '@base-ui/react/field';
import type { Input as InputPrimitive } from '@base-ui/react/input';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ChangeEvent, type ComponentProps } from 'react';
import { radiusVariants } from '../../shared/radius';
import { useFieldContext } from '../field';

import styles from './text-area.module.css';

const textAreaVariants = cva(styles.textarea, {
  variants: {
    ...radiusVariants,
    /** Size of the text area. */
    size: {
      small: styles['size-small'],
      medium: styles['size-medium']
    },
    /** Visual style of the text area. */
    variant: {
      outline: null,
      text: styles['variant-text']
    }
  },
  defaultVariants: {
    size: 'medium',
    variant: 'outline'
  }
});

export interface TextAreaProps
  extends Omit<ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof textAreaVariants> {
  /**
   * Whether the text area is disabled.
   * @default false
   */
  disabled?: boolean;
  /** Text shown when the text area is empty. */
  placeholder?: string;
  /**
   * Number of visible text rows.
   * @default 3
   */
  rows?: number;
  /** The value of the text area. Use when controlled. */
  value?: string;
  /** Called with the React change event when the value changes. */
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Called with the new string value when the value changes. It runs after `onChange`. */
  onValueChange?: (
    value: string,
    eventDetails: InputPrimitive.ChangeEventDetails
  ) => void;
}

export function TextArea({
  className,
  disabled,
  value,
  onChange,
  onValueChange,
  placeholder,
  required,
  size,
  radius,
  variant,
  ...props
}: TextAreaProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    onValueChange?.(
      event.target.value,
      createChangeEventDetails(REASONS.none, event.nativeEvent)
    );
  };

  const textarea = (
    <textarea
      rows={3}
      data-slot='text-area'
      className={cx(
        textAreaVariants({ size, variant, radius }),
        disabled && styles.disabled,
        className
      )}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      required={resolvedRequired}
      {...props}
    />
  );

  if (fieldContext) {
    return <FieldPrimitive.Control render={textarea} />;
  }

  return textarea;
}

TextArea.displayName = 'TextArea';
