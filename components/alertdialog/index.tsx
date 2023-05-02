import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { overlayStyles } from "../overlay";
import { panelStyles } from "../panel";

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, overlayStyles, {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
});

export const StyledContent = styled(AlertDialogPrimitive.Content, panelStyles, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 200,
    maxHeight: "85vh",
    padding: "$4",
    marginTop: "-5vh",

    "&:focus": {
        outline: "none",
    },
});

type AlertDialogContentPrimitiveProps = React.ComponentProps<typeof AlertDialogPrimitive.Content>;
type AlertDialogContentProps = AlertDialogContentPrimitiveProps & { css?: CSS };

const AlertDialogContent = React.forwardRef<React.ElementRef<typeof StyledContent>, AlertDialogContentProps>(
    ({ children, ...props }, forwardedRef) => (
        <AlertDialogPrimitive.Portal>
            <StyledOverlay />
            <StyledContent {...props} ref={forwardedRef}>
                {children}
            </StyledContent>
        </AlertDialogPrimitive.Portal>
    ),
);

const AlertDialogRoot = styled(AlertDialogPrimitive.Root, {});
export const AlertDialog = Object.assign(AlertDialogRoot, {
    Content: AlertDialogContent,
    Trigger: AlertDialogPrimitive.Trigger,
    Title: AlertDialogPrimitive.Title,
    Description: AlertDialogPrimitive.Description,
    Action: AlertDialogPrimitive.Action,
    Cancel: AlertDialogPrimitive.Cancel,
});
