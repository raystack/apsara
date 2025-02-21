import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import styles from "./overlay.module.css";

const overlay = cva(styles.overlay);

export interface OverlayProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof overlay> {}

export const Overlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  OverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={overlay({ className })}
    aria-hidden="true"
    role="presentation"
    {...props}
  />
));

Overlay.displayName = DialogPrimitive.Overlay.displayName;