import * as SwitchPrimitive from "@radix-ui/react-switch";
import React from "react";
import { CSS, styled, VariantProps } from "~/stitches.config";

const StyledThumb = styled(SwitchPrimitive.Thumb, {
    position: "absolute",
    left: 0,
    width: 16,
    height: 16,
    backgroundColor: "$gray1",
    borderRadius: "$round",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    transition: "transform 100ms cubic-bezier(0.22, 1, 0.36, 1)",
    transform: "translateX(1px)",
    willChange: "transform",

    '&[data-state="checked"]': {
        transform: "translateX(11px)",
    },
});

const StyledSwitch = styled(SwitchPrimitive.Root, {
    all: "unset",
    boxSizing: "border-box",
    userSelect: "none",
    "&::before": {
        boxSizing: "border-box",
    },
    "&::after": {
        boxSizing: "border-box",
    },

    // Reset
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    lineHeight: "1",
    margin: "0",
    outline: "none",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",

    width: "34px",
    height: "20px",
    backgroundColor: "$gray9",
    borderRadius: "16px",
    position: "relative",
    "&:focus": {},

    '&[data-state="checked"]': {
        backgroundColor: "$violet9",
    },

    [`& ${StyledThumb}`]: {
        width: 16,
        height: 16,
        transform: "translateX(2px)",
        '&[data-state="checked"]': {
            transform: "translateX(16px)",
        },
    },
});

type SwitchVariants = VariantProps<typeof StyledSwitch>;
type SwitchPrimitiveProps = React.ComponentProps<typeof SwitchPrimitive.Root>;
type SwitchProps = SwitchPrimitiveProps & SwitchVariants & { css?: CSS };

export const Switch = React.forwardRef<React.ElementRef<typeof StyledSwitch>, SwitchProps>((props, forwardedRef) => (
    <StyledSwitch {...props} ref={forwardedRef}>
        <StyledThumb />
    </StyledSwitch>
));
