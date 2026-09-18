'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusClass } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './popover.module.css';

export interface PopoverContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PopoverPrimitive.Popup.Props {
  /** Corner radius for this popup only. Overrides the theme's `radius`. */
  radius?: Radius;
}

function PopoverContent({
  ref,
  initialFocus,
  finalFocus,
  className,
  style,
  render,
  children,
  radius,
  ...positionerProps
}: PopoverContentProps) {
  const theme = useThemeInjection();
  return (
    <PopoverPrimitive.Portal {...theme}>
      <PopoverPrimitive.Positioner
        sideOffset={4}
        collisionPadding={3}
        className={styles.popoverPositioner}
        data-slot='popover-positioner'
        {...positionerProps}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          {...theme}
          className={cx(
            styles.popover,
            theme?.className,
            radiusClass(radius),
            className
          )}
          render={render}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          style={style}
          data-slot='popover-content'
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = 'Popover.Content';

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Close: PopoverPrimitive.Close,
  Content: PopoverContent,
  createHandle: PopoverPrimitive.createHandle
});
