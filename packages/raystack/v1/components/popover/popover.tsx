import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import React from "react";

import styles from "./popover.module.css";

const popoverContent = cva(styles.popover);

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  ariaLabel?: string;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  ariaLabel = "Popover content",
  collisionPadding = 3,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      avoidCollisions
      className={popoverContent({ className })}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      {...props}
    >
      {props.children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Close: PopoverPrimitive.Close,
  Content: PopoverContent,
});
