import { styled } from "../../stitches.config";

export const TextField = styled("input", {
  // Reset
  appearance: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  margin: "0",
  outline: "none",
  padding: "0",
  width: "100%",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  // Custom
  backgroundColor: "$bgBase",
  border: "0.5px solid $colors$borderBase",
  boxShadow: "$xs",
  borderRadius: "$1",
  color: "$fgBase",
  fontVariantNumeric: "tabular-nums",

  "&:-webkit-autofill": {
    boxShadow:
      "inset 0 0 0 1px $colors$borderAccent, inset 0 0 0 100px $colors$borderAccent",
  },

  "&:-webkit-autofill::first-line": {
    fontFamily: "$untitled",
    color: "$fgBase",
  },

  "&:focus": {
    border: "1px solid $borderAccentInverted",
  },
  "&::placeholder": {
    color: "$fgSubtle",
    fontSize: "12px",
    lineHeight: "16px",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: "0.6",
    pointerEvents: "none",
  },
  "&:read-only": {
    backgroundColor: "$bgBase",
  },

  variants: {
    size: {
      sm: {
        borderRadius: "$1",
        height: "auto",
        fontSize: "$2",
        padding: "$1",
        lineHeight: "$sizes$4",
        "&:-webkit-autofill::first-line": {
          fontSize: "$2",
        },
      },
      md: {
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

    state: {
      invalid: {
        border: "1px solid $colors$borderDanger",
        "&:focus": {
          border: "1px solid $colors$borderDanger",
        },
      },
      valid: {
        border: "1px solid $colors$borderSuccess",
        "&:focus": {
          border: "1px solid $colors$borderSuccess",
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
    size: "sm",
  },
});
