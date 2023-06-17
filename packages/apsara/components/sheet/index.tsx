import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, keyframes, styled, VariantProps } from "../../stitches.config";
import { overlayStyles } from "../overlay";

const fadeIn = keyframes({
  from: { opacity: "0" },
  to: { opacity: "1" },
});

const fadeOut = keyframes({
  from: { opacity: "1" },
  to: { opacity: "0" },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, overlayStyles, {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2,

  '&[data-state="open"]': {
    animation: `${fadeIn} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  '&[data-state="closed"]': {
    animation: `${fadeOut} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },
});

const slideIn = keyframes({
  from: { transform: "$$transformValue" },
  to: { transform: "translate3d(0,0,0)" },
});

const slideOut = keyframes({
  from: { transform: "translate3d(0,0,0)" },
  to: { transform: "$$transformValue" },
});

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: "$bgInset",
  boxShadow: "$sm",
  position: "fixed",
  zIndex: 50,
  top: 0,
  bottom: 0,
  width: 250,

  // Among other things, prevents text alignment inconsistencies when dialog can't be centered in the viewport evenly.
  // Affects animated and non-animated dialogs alike.
  willChange: "transform",

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  '&[data-state="closed"]': {
    animation: `${slideOut} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  variants: {
    side: {
      top: {
        $$transformValue: "translate3d(0,-100%,0)",
        width: "100%",
        height: 300,
        bottom: "auto",
      },
      right: {
        $$transformValue: "translate3d(100%,0,0)",
        right: 0,
      },
      bottom: {
        $$transformValue: "translate3d(0,100%,0)",
        width: "100%",
        height: 300,
        bottom: 0,
        top: "auto",
      },
      left: {
        $$transformValue: "translate3d(-100%,0,0)",
        left: 0,
      },
    },
  },

  defaultVariants: {
    side: "right",
  },
});

const StyledCloseButton = styled(DialogPrimitive.Close, {
  position: "absolute",
  top: "$2",
  right: "$2",
});

type SheetContentVariants = VariantProps<typeof StyledContent>;
type DialogContentPrimitiveProps = React.ComponentProps<
  typeof DialogPrimitive.Content
>;
type SheetContentProps = DialogContentPrimitiveProps &
  SheetContentVariants & { css?: CSS; close?: boolean };

const SheetContent = React.forwardRef<
  React.ElementRef<typeof StyledContent>,
  SheetContentProps
>(({ children, close, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <StyledOverlay />
    <StyledContent {...props} ref={forwardedRef}>
      {children}
      {close && (
        <StyledCloseButton asChild>
          <Cross1Icon />
        </StyledCloseButton>
      )}
    </StyledContent>
  </DialogPrimitive.Portal>
));

const SheetRoot = styled(DialogPrimitive.Root, {});
export const Sheet = Object.assign(SheetRoot, {
  Trigger: DialogPrimitive.Trigger,
  Content: SheetContent,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
});
