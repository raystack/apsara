import { styled } from "~/stitches.config";

export const Button = styled("button", {
    // Reset
    all: "unset",
    alignItems: "center",
    boxSizing: "border-box",
    userSelect: "none",
    "&::before": {
        boxSizing: "border-box",
    },
    "&::after": {
        boxSizing: "border-box",
    },

    // Custom reset?
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    lineHeight: "1",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",

    // Custom
    height: "$25",
    px: "$10",
    fontSize: "$14",
    fontWeight: 500,

    "&:disabled": {
        backgroundColor: "$slate2",
        boxShadow: "inset 0 0 0 1px $colors$slate7",
        color: "$slate8",
        pointerEvents: "none",
    },

    variants: {
        size: {
            small: {
                borderRadius: "$1",
                height: "$4",
                px: "$2",
                fontSize: "$1",
                lineHeight: "$sizes$4",
            },
            normal: {
                borderRadius: "$1",
                height: "$5",
                px: "$3",
                fontSize: "$3",
                lineHeight: "$sizes$5",
            },
            large: {
                borderRadius: "$1",
                height: "$6",
                px: "$4",
                fontSize: "$4",
                lineHeight: "$sizes$6",
            },
        },
        variant: {
            primary: {
                backgroundColor: "$violet9",
                boxShadow: "inset 0 0 0 1px $colors$violet9",
                color: "$gray1",
                "@hover": {
                    "&:hover": {
                        boxShadow: "inset 0 0 0 1px $colors$violet10",
                    },
                },
                "&:active": {
                    backgroundColor: "$violet10",
                    boxShadow: "inset 0 0 0 1px $colors$violet8",
                },
                "&:focus": {
                    boxShadow: "inset 0 0 0 1px $colors$violet8, 0 0 0 1px $colors$violet8",
                },
                '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
                    {
                        backgroundColor: "$violet10",
                        boxShadow: "inset 0 0 0 1px $colors$violet8",
                    },
            },
            secondary: {
                backgroundColor: "$loContrast",
                boxShadow: "inset 0 0 0 1px $colors$slate7",
                color: "$hiContrast",
                "@hover": {
                    "&:hover": {
                        boxShadow: "inset 0 0 0 1px $colors$slate8",
                    },
                },
                "&:active": {
                    backgroundColor: "$slate2",
                    boxShadow: "inset 0 0 0 1px $colors$slate8",
                },
                "&:focus": {
                    boxShadow: "inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8",
                },
                '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
                    {
                        backgroundColor: "$slate4",
                        boxShadow: "inset 0 0 0 1px $colors$slate8",
                    },
            },
        },
    },

    defaultVariants: {
        size: "normal",
        variant: "secondary",
    },
});
