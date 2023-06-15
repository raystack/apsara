import * as ProgressPrimitive from "@radix-ui/react-progress";
import React from "react";
import { CSS, keyframes, styled, VariantProps } from "~/stitches.config";

const indeterminateProgress = keyframes({
    "0%": {
        transform: "scaleX(1) translateX(-100%)",
        transformOrigin: "left",
    },
    "50%": {
        transform: "scaleX(1) translateX(1000%)",
        transformOrigin: "left",
    },
    "100%": {
        transform: "scaleX(1) translateX(2000%)",
        transformOrigin: "left",
    },
});

const StyledProgressBar = styled(ProgressPrimitive.Root, {
    boxSizing: "border-box",
    position: "relative",
    height: "$1",
    overflow: "hidden",
    borderRadius: "$pill",

    '&[data-state="indeterminate"]': {
        backgroundColor: "$bgBase",
        "&::after": {
            animationName: indeterminateProgress,
            animationDuration: "1500ms",
            animationIterationCount: "infinite",
            animationTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
            backgroundColor: "$bgInset",
            boxSizing: "border-box",
            borderRadius: "$pill",
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "5%",
        },
    },
});

const ProgressBarIndicator = styled(ProgressPrimitive.Indicator, {
    boxSizing: "border-box",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "$bgBase",
    transition: "transform 150ms cubic-bezier(0.65, 0, 0.35, 1)",
});

type ProgressBarVariants = VariantProps<typeof StyledProgressBar>;
type ProgressBarPrimitiveProps = React.ComponentProps<typeof ProgressPrimitive.Root>;
type ProgressBarProps = ProgressBarPrimitiveProps & ProgressBarVariants & { css?: CSS };

export const ProgressBar = React.forwardRef<React.ElementRef<typeof StyledProgressBar>, ProgressBarProps>(
    ({ value, max = 100, ...props }, forwardedRef) => {
        const percentage = value != null ? Math.round((value / max) * 100) : null;

        return (
            <StyledProgressBar {...props} ref={forwardedRef} value={value} max={max}>
                <ProgressBarIndicator style={{ transform: `translateX(${percentage}%)` }} />
            </StyledProgressBar>
        );
    },
);
