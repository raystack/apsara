'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './popover.module.css';

export interface PopoverContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    PopoverPrimitive.Popup.Props {}

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
            className={cx(styles.popover, className)}
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
