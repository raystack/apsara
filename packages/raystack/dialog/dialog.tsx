import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";

import styles from "./dialog.module.css";

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
const dialogContent = cva(styles.dialogContent);

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContent> {}

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps & {
    close?: boolean;
    overlayStyle?: React.CSSProperties;
    overlayClassname?: string;
    overlayBlur?: boolean;
  }
>(
  (
    { className, children, close, overlayStyle, overlayClassname, overlayBlur, ...props },
    forwardedRef
  ) => {
    return (
      <DialogPrimitive.Portal>
        <Overlay className={overlayClassname} style={overlayStyle} blur={overlayBlur}>
          <DialogPrimitive.Content
            {...props}
            ref={forwardedRef}
            className={dialogContent({ className })}
          >
            {children}
            {close && (
              <CloseButton>
                <Cross1Icon />
              </CloseButton>
            )}
          </DialogPrimitive.Content>
        </Overlay>
      </DialogPrimitive.Portal>
    );
  }
);

const overlay = cva(styles.overlay, {
  variants: {
    blur: {
      true: styles.overlayBlur,
    },
  },
});

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
export interface OverlayProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof overlay> {}

const Overlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  OverlayProps
>(({ className, blur, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={overlay({ className, blur })}
    {...props}
  />
));

Overlay.displayName = DialogPrimitive.Overlay.displayName;

const close = cva(styles.close);
type CloseButtonProps = ComponentProps<typeof DialogPrimitive.Close>;

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
export function CloseButton({
  children,
  className,
  ...props
}: CloseButtonProps) {
  return (
    <DialogPrimitive.Close className={close({ className })} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}

/*
 *  @deprecated Use Dialog from @raystack/apsara/v1 instead.
 */
export const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
});
