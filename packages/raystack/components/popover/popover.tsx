'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './popover.module.css';

const popover = cva(undefined, {
  variants: {
    variant: {
      default: styles.popover,
      unstyled: styles.popoverUnstyled
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface PopoverContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    PopoverPrimitive.Popup.Props,
    VariantProps<typeof popover> {}

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(
  (
    {
      initialFocus,
      finalFocus,
      className,
      style,
      render,
      children,
      variant,
      ...positionerProps
    },
    ref
  ) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          sideOffset={4}
          collisionPadding={3}
          className={styles.popoverPositioner}
          {...positionerProps}
        >
          <PopoverPrimitive.Popup
            ref={ref}
            className={popover({ variant, className })}
            render={render}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            style={style}
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = 'Popover.Content';

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Close: PopoverPrimitive.Close,
  Content: PopoverContent
});
