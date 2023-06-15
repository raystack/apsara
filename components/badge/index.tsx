import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled } from "~/stitches.config";
import { Flex } from "../flex";

const StyledBadge = styled("span", {
    // Reset
    alignItems: "center",
    appearance: "none",
    borderWidth: "0",
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: "inherit",
    justifyContent: "center",
    lineHeight: "1",
    verticalAlign: "middle",
    outline: "none",
    padding: "0",
    textDecoration: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
    "&:disabled": {
        backgroundColor: "$bgBase",
        pointerEvents: "none",
        color: "$fgBase",
    },
    "&::before": {
        boxSizing: "border-box",
        content: '""',
    },
    "&::after": {
        boxSizing: "border-box",
        content: '""',
    },

    // Custom
    backgroundColor: "$bgBase",
    borderRadius: "$pill",
    color: "$fbBase",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",

    variants: {
        size: {
            "1": {
                height: "$4",
                px: "$1",
                fontSize: "$1",
            },
            "2": {
                height: "$5",
                px: "$2",
                fontSize: "$2",
            },
        },
    },

    defaultVariants: {
        size: "1",
    },
});

const StyledVerifiedBadge = styled("div", Flex, {
    alignItems: "center",
    backgroundColor: "$bgInset",
    borderRadius: "$round",
    color: "white",
    flexShrink: 0,
    justifyContent: "center",
    width: "$3",
    height: "$3",
});

type VerifiedBadgeProps = React.ComponentProps<typeof StyledVerifiedBadge> & { css?: CSS };

const VerifiedBadge = React.forwardRef<React.ElementRef<typeof StyledVerifiedBadge>, VerifiedBadgeProps>(
    (props, forwardedRef) => (
        <StyledVerifiedBadge {...props} ref={forwardedRef}>
            <CheckIcon />
        </StyledVerifiedBadge>
    ),
);

export const Badge = Object.assign(StyledBadge, {
    Verified: VerifiedBadge,
});
