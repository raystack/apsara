'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './popover.module.css';
import { PopoverSurface, type PopoverSurfaceProps } from './popover-surface';

export interface PopoverContentProps
  extends Omit<
    PopoverSurfaceProps,
    'positionerClassName' | 'positionerSlot' | 'popupSlot'
  > {}

function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <PopoverSurface
      positionerClassName={styles.popoverPositioner}
      positionerSlot='popover-positioner'
      popupSlot='popover-content'
      className={cx(styles.popover, className)}
      {...props}
    />
  );
}
PopoverContent.displayName = 'Popover.Content';

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Close: PopoverPrimitive.Close,
  Content: PopoverContent,
  createHandle: PopoverPrimitive.createHandle
});
