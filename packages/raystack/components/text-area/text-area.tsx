import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ChangeEvent, type ComponentProps } from 'react';
import { useFieldContext } from '../field';

import styles from './text-area.module.css';

const textAreaVariants = cva(styles.textarea, {
  variants: {
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
    event: ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export function TextArea({
  className,
  style,
  disabled,
  value,
  onChange,
  onValueChange,
  placeholder,
  required,
  size,
  variant,
  ...props
}: TextAreaProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value, event);
  };

  const textarea = (
    <textarea
      rows={3}
      className={cx(
        textAreaVariants({ size, variant }),
        disabled && styles.disabled,
        className
      )}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      required={resolvedRequired}
      style={style}
      {...props}
    />
  );

  if (fieldContext) {
    return <FieldPrimitive.Control render={textarea} />;
  }

  return textarea;
}

TextArea.displayName = 'TextArea';
