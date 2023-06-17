import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { overlayStyles } from "../overlay";
import { panelStyles } from "../panel";

const StyledOverlay = styled(DialogPrimitive.Overlay, overlayStyles, {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const StyledContent = styled(DialogPrimitive.Content, panelStyles, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 200,
  maxHeight: "85vh",
  padding: "$4",
  marginTop: "-5vh",
  zIndex: 50,

  // Among other things, prevents text alignment inconsistencies when dialog can't be centered in the viewport evenly.
  // Affects animated and non-animated dialogs alike.
  willChange: "transform",

  "&:focus": {
    outline: "none",
  },
});

const StyledCloseButton = styled(DialogPrimitive.Close, {
  position: "absolute",
  top: "$2",
  right: "$2",
});

type DialogContentPrimitiveProps = React.ComponentProps<
  typeof DialogPrimitive.Content
>;
type DialogContentProps = DialogContentPrimitiveProps & {
  css?: CSS;
  close?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof StyledContent>,
  DialogContentProps
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

const DialogPrimitiveRoot = styled(DialogPrimitive.Root, {});
export const Dialog = Object.assign(DialogPrimitiveRoot, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
});
