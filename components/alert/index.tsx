import React from "react";
import { styled } from "~/stitches.config";
import { Text } from "../text";

export const StyledRoot = styled("div", {
    // Reset
    boxSizing: "border-box",
    "&::before": {
        boxSizing: "border-box",
    },
    "&::after": {
        boxSizing: "border-box",
    },

    border: "1px solid $gray8",
    borderRadius: "$2",
    padding: "$2",

    variants: {
        variant: {
            gray: {
                "&::before": {
                    boxShadow: "inset 0 0 0 1px $colors$slate9",
                },
            },
            info: {
                "&::before": {
                    boxShadow: "inset 0 0 0 1px $colors$primary9",
                },
            },
            success: {
                "&::before": {
                    boxShadow: "inset 0 0 0 1px $colors$green9",
                },
            },
            warning: {
                "&::before": {
                    boxShadow: "inset 0 0 0 1px $colors$orange9",
                },
            },
            error: {
                "&::before": {
                    boxShadow: "inset 0 0 0 1px $colors$red9",
                },
            },
        },
    },
});
const AlertRoot = React.forwardRef<React.ElementRef<typeof StyledRoot>, React.ComponentProps<typeof StyledRoot>>(
    ({ children, ...props }, forwardedRef) => (
        <StyledRoot role="alert" ref={forwardedRef} {...props}>
            {children}
        </StyledRoot>
    ),
);
AlertRoot.displayName = "Alert";

const AlertTitle = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentProps<typeof Text>>(
    ({ className, ...props }, ref) => <Text ref={ref} css={{ fontWeight: "500" }} {...props} />,
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentProps<typeof Text>>(
    ({ className, ...props }, ref) => <Text ref={ref} {...props} />,
);
AlertDescription.displayName = "AlertDescription";

export const Alert = Object.assign(AlertRoot, {
    Description: AlertDescription,
    Title: AlertTitle,
});
