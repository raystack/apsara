'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './popover.module.css';

export interface PopoverContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PopoverPrimitive.Popup.Props {
  /** Portals into this element instead of `document.body`. */
  container?: PortalContainer;
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
  container,
  radius,
  ...positionerProps
}: PopoverContentProps) {
  const theme = useThemeInjection();
  return (
    <PopoverPrimitive.Portal container={container}>
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
