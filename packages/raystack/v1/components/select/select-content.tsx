import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cx } from "class-variance-authority";
import styles from "./select.module.css";

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cx(styles.content, className)}
      position={position}
      onPointerDownOutside={e => {
        e.stopPropagation();
      }}
      {...props}>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;
