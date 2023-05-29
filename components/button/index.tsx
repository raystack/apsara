import { styled } from "~/stitches.config";

export const Button = styled("button", {
    // Reset
    all: "unset",
    alignItems: "center",
    boxSizing: "border-box",
    userSelect: "none",
    cursor: "pointer",
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
    WebkitTapHighlightColor: "rgba(0,0,0,0)",

    // Custom
    px: "$3",
    fontSize: "$1",
    lineHeight: "16px",
    fontWeight: 500,

    "&:disabled": {
        backgroundColor: "$slate2",
        boxShadow: "inset 0 0 0 1px $colors$slate7",
        color: "$slate8",
        opacity: "0.6",
        pointerEvents: "none",
    },

    variants: {
        ghost: {
            true: {
                bg: "transparent",
                "&:hover": {
                    bg: "transparent",
                },
                "&:focus": {
                    bg: "transparent",
                },
            },
        },
        size: {
            small: {
                py: "$1",
                px: "$3",
                borderRadius: "$1",
            },
            medium: {
                py: "$2",
                px: "$3",
                borderRadius: "$1",
            },
            circle: {
                padding: "$2",
                width: "24px",
                height: "24px",
                borderRadius: "$round",
            },
        },
        outline: {
            true: {
                border: "1px dashed $gray6",
            },
        },
        variant: {
            primary: {
                backgroundColor: "$primary9",
                color: "$gray1",
                "&:hover": {
                    backgroundColor: "$primary10",
                },
                "&:disabled": {
                    backgroundColor: "$primary8",
                },
                "&:active": {
                    backgroundColor: "$primary10",
                },
                "&:focus": {
                    boxShadow: "inset 0 0 0 1px $colors$primary8, 0 0 0 1px $colors$primary8",
                },
                '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
                    {
                        backgroundColor: "$primary10",
                    },
            },
            secondary: {
                backgroundColor: "$gray1",
                color: "$gray11",
                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1)",

                "&:hover": {
                    backgroundColor: "$gray4",
                    border: "1px solid $gray7",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                },

                "&:active": {
                    backgroundColor: "$gray4",
                    border: "1px solid $gray7",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                    },
                },
                "&:disabled": {
                    backgroundColor: "$gray1",
                    border: "1px solid $gray6",
                    boxShadow: "0 1px 1px 0 $colors$bslate8lack",
                },
                "&:focus": {
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                },
                '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
                    {
                        backgroundColor: "$gray7",
                        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                    },
            },
        },
    },
    compoundVariants: [],
    defaultVariants: {
        size: "medium",
    },
});
