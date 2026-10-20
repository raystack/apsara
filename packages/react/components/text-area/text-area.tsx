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
    size: {
      small: styles['size-small'],
      large: styles['size-large']
    },
    variant: {
      default: styles['variant-default'],
      borderless: styles['variant-borderless']
    }
  },
  defaultVariants: {
    size: 'large',
    variant: 'default'
  }
});

export interface TextAreaProps
  extends Omit<ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof textAreaVariants> {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
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
