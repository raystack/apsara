'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ArrowSvg, arrowClassName } from '../../shared/arrow';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './popover.module.css';

export interface PopoverContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PopoverPrimitive.Popup.Props {
  /**
   * Shows an arrow that points at the trigger.
   * @default false
   */
  showArrow?: boolean;
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
  showArrow = false,
  sideOffset = showArrow ? 10 : 4,
  ...positionerProps
}: PopoverContentProps) {
  const theme = useThemeInjection();
  return (
    <PopoverPrimitive.Portal {...theme}>
      <PopoverPrimitive.Positioner
        sideOffset={sideOffset}
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
            showArrow && styles['show-arrow'],
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          render={render}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          style={style}
          data-slot='popover-content'
        >
          {children}
          {showArrow && (
            <PopoverPrimitive.Arrow
              className={arrowClassName}
              data-slot='popover-arrow'
            >
              <ArrowSvg />
            </PopoverPrimitive.Arrow>
          )}
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
