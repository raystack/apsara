import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { overlayStyles } from "../overlay";
import { panelStyles } from "../panel";

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, overlayStyles, {
    position: "fixed",
    inset: 0,
    zIndex: 2,
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
    zIndex: 50,

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
const AlertTitle = styled(AlertDialogPrimitive.Title, {
    fontSize: "$9",
    lineHeight: "32px",
});
const AlertDescription = styled(AlertDialogPrimitive.Description, {
    fontSize: "$2",
    lineHeight: "16px",
    letterSpacing: "0.4px",
});
export const AlertDialog = Object.assign(AlertDialogRoot, {
    Content: AlertDialogContent,
    Trigger: AlertDialogPrimitive.Trigger,
    Title: AlertTitle,
    Description: AlertDescription,
    Action: AlertDialogPrimitive.Action,
    Cancel: AlertDialogPrimitive.Cancel,
});
