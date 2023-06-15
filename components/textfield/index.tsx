import { styled } from "~/stitches.config";

export const TextField = styled("input", {
    // Reset
    appearance: "none",
    borderWidth: "0",
    boxSizing: "border-box",
    fontFamily: "inherit",
    margin: "0",
    outline: "none",
    padding: "0",
    width: "100%",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
    "&::before": {
        boxSizing: "border-box",
    },
    "&::after": {
        boxSizing: "border-box",
    },

    // Custom
    backgroundColor: "$bgBase",
    boxShadow: "inset 0 0 0 1px $borderBase",
    color: "$fgBase",
    fontVariantNumeric: "tabular-nums",

    "&:-webkit-autofill": {
        boxShadow: "inset 0 0 0 1px $borderAccent, inset 0 0 0 100px $borderAccent",
    },

    "&:-webkit-autofill::first-line": {
        fontFamily: "$untitled",
        color: "$fgBase",
    },

    "&:focus": {
        boxShadow: "inset 0px 0px 0px 1px $borderAccentHover, 0px 0px 0px 1px $borderAccentHover",
        "&:-webkit-autofill": {
            boxShadow:
                "inset 0px 0px 0px 1px $borderAccentHover, 0px 0px 0px 1px $borderAccentHover, inset 0 0 0 100px $borderAccentHover",
        },
    },
    "&::placeholder": {
        color: "$fgBase",
    },
    "&:disabled": {
        pointerEvents: "none",
        backgroundColor: "$bgBase",
        color: "$fgBase",
        cursor: "not-allowed",
        "&::placeholder": {
            color: "$fgBase",
        },
    },
    "&:read-only": {
        backgroundColor: "$bgBase",
        "&:focus": {
            boxShadow: "inset 0px 0px 0px 1px $borderBase",
        },
    },

    variants: {
        size: {
            "1": {
                borderRadius: "$1",
                height: "auto",
                fontSize: "$2",
                padding: "$1",
                lineHeight: "$sizes$4",
                "&:-webkit-autofill::first-line": {
                    fontSize: "$2",
                },
            },
            "2": {
                borderRadius: "$2",
                height: "auto",
                fontSize: "$3",
                padding: "$2",
                lineHeight: "$sizes$4",
                "&:-webkit-autofill::first-line": {
                    fontSize: "$3",
                },
            },
        },
        variant: {
            ghost: {
                boxShadow: "none",
                backgroundColor: "transparent",
                "@hover": {
                    "&:hover": {
                        boxShadow: "inset 0 0 0 1px $borderBase",
                    },
                },
                "&:focus": {
                    backgroundColor: "$bgBase",
                    boxShadow:
                        "inset 0px 0px 0px 1px $borderAccentInvertedHover, 0px 0px 0px 1px $borderAccentInvertedHover",
                },
                "&:disabled": {
                    backgroundColor: "transparent",
                },
                "&:read-only": {
                    backgroundColor: "transparent",
                },
            },
        },
        state: {
            invalid: {
                boxShadow: "inset 0 0 0 1px $borderDanger",
                "&:focus": {
                    boxShadow: "inset 0px 0px 0px 1px $borderDanger, 0px 0px 0px 1px $borderDanger",
                },
            },
            valid: {
                boxShadow: "inset 0 0 0 1px $borderSuccess",
                "&:focus": {
                    boxShadow: "inset 0px 0px 0px 1px $borderSuccess, 0px 0px 0px 1px $borderSuccess",
                },
            },
        },
        cursor: {
            default: {
                cursor: "default",
                "&:focus": {
                    cursor: "text",
                },
            },
            text: {
                cursor: "text",
            },
        },
    },
    defaultVariants: {
        size: "1",
    },
});
