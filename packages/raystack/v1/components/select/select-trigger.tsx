import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { VariantProps, cva } from 'class-variance-authority';
import { ElementRef, SVGAttributes, forwardRef } from 'react';
import styles from './select.module.css';

export interface AriaProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
}

export interface TriggerStyleProps {
  style?: React.CSSProperties;
  className?: string;
  stopPropagation?: boolean;
}

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

const trigger = cva(styles.trigger, {
  variants: {
    size: {
      small: styles['trigger-small'],
      medium: styles['trigger-medium']
    },
    variant: {
      outline: styles['trigger-outline'],
      text: styles['trigger-text']
    }
  },
  defaultVariants: {
    size: 'medium',
    variant: 'outline'
  }
});

type SelectTriggerProps = SelectPrimitive.SelectTriggerProps &
  VariantProps<typeof trigger> & {
    iconProps?: IconProps;
  } & AriaProps &
  TriggerStyleProps;

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      size,
      variant,
      className,
      children,
      iconProps = {},
      'aria-label': ariaLabel,
      style,
      stopPropagation = false,
      ...props
    },
    ref
  ) => {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={trigger({ size, variant, className })}
        aria-label={ariaLabel || 'Select option'}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'space-between'
        }}
        onPointerDown={e => {
          if (stopPropagation) {
            e.stopPropagation();
          }
        }}
        {...props}
      >
        <div className={styles.triggerContent}>{children}</div>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon
            className={styles.triggerIcon}
            aria-hidden='true'
            {...iconProps}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
