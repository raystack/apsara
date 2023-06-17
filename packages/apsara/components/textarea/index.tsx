import { styled } from "../../stitches.config";

export const TextArea = styled("textarea", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  fontFamily: "inherit",
  margin: "0",
  outline: "none",
  padding: "$1",
  width: "100%",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  backgroundColor: "$bgBase",
  boxShadow: "inset 0 0 0 1px $bgBase",
  color: "$fgBase",
  fontVariantNumeric: "tabular-nums",
  position: "relative",
  minHeight: 80,
  resize: "vertical",

  "&:focus": {
    boxShadow: "inset 0px 0px 0px 1px $fgSubtle, 0px 0px 0px 1px $fgSubtle",
    zIndex: "1",
  },
  "&::placeholder": {
    color: "$fgSubtle",
  },
  "&:disabled": {
    pointerEvents: "none",
    backgroundColor: "$bgSubtle",
    color: "$fgSubtle",
    cursor: "not-allowed",
    resize: "none",
    "&::placeholder": {
      color: "$fgBase",
    },
  },
  "&:read-only": {
    backgroundColor: "$bgBase",
    "&:focus": {
      boxShadow: "inset 0px 0px 0px 1px $bgBase",
    },
  },

  variants: {
    size: {
      "1": {
        borderRadius: "$1",
        fontSize: "$1",
        lineHeight: "16px",
        px: "$1",
      },
      "2": {
        borderRadius: "$1",
        fontSize: "$2",
        lineHeight: "20px",
        px: "$1",
      },
      "3": {
        borderRadius: "$2",
        fontSize: "$3",
        lineHeight: "23px",
        px: "$2",
      },
    },
    state: {
      invalid: {
        boxShadow: "inset 0 0 0 1px $fgDanger",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $borderDanger, 0px 0px 0px 1px $borderDanger",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $borderSuccess",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $borderSuccess, 0px 0px 0px 1px $borderSuccess",
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
