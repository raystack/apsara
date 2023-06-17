import { styled } from "../../stitches.config";

export const Button = styled("button", {
  // Reset
  all: "unset",
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
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  // Custom
  py: "$1",
  px: "$3",
  fontSize: "$1",
  lineHeight: "16px",
  borderRadius: "$1",
  fontWeight: 500,

  "&:disabled": {
    opacity: 0.6,
  },

  variants: {
    size: {
      small: {
        py: "$1",
      },
      medium: {
        py: "$2",
      },
      circle: {
        padding: "$2",
        width: "24px",
        height: "24px",
        borderRadius: "$round",
      },
    },
    disabled: {
      true: {
        opacity: "0.6",
      },
    },
    variant: {
      primary: {
        color: "$fgInverted",
        backgroundColor: "$bgAccentInverted",
        "&:hover": {
          backgroundColor: "$bgAccentInvertedHover",
        },
        "&:disabled": {
          opacity: 0.6,
        },
        "&:active": {
          backgroundColor: "$bgAccentInvertedHover",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$bgAccentInvertedHover",
          },
      },
      outline: {
        color: "$fgAccent",
        backgroundColor: "$bgBase",
        border: "1px solid $borderAccentInverted",

        "&:hover": {
          backgroundColor: "$bgAccent",
          border: "1px solid $borderAccentInverted",
        },
        "&:disabled": {
          opacity: 0.6,
          pointerEvents: "none",
        },
        "&:active": {
          backgroundColor: "$bgAccent",
          border: "1px solid $borderAccentInverted",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$bgAccent",
            border: "1px solid $borderAccentInverted",
          },
      },
      secondary: {
        color: "$fgBase",
        backgroundColor: "$bgBase",
        border: "1px solid $borderBase",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.09)",

        "&:hover": {
          backgroundColor: "$bgBaseHover",
          border: "1px solid $borderBaseHover",
        },
        "&:disabled": {
          opacity: 0.6,
        },
        "&:active": {
          backgroundColor: "$bgBaseHover",
          border: "1px solid $borderBaseHover",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$bgBaseHover",
            border: "1px solid $borderBaseHover",
          },
      },
      ghost: {
        color: "$fgBase",
        backgroundColor: "$bgBase",
        border: "1px dashed $borderBase",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.09)",

        "&:hover": {
          backgroundColor: "$bgBaseHover",
          border: "1px dashed $borderBaseHover",
        },
        "&:disabled": {
          opacity: 0.6,
        },
        "&:active": {
          backgroundColor: "$bgBaseHover",
          border: "1px dashed $borderBaseHover",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$bgBaseHover",
            border: "1px dashed $borderBaseHover",
          },
      },
      danger: {
        color: "$fgInverted",
        backgroundColor: "$bgDangerInverted",

        "&:hover": {
          backgroundColor: "$bgDangerInvertedHover",
        },
        "&:disabled": {
          opacity: 0.6,
        },
        "&:active": {
          backgroundColor: "$bgDangerInvertedHover",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$bgDangerInvertedHover",
          },
      },
    },
  },
  compoundVariants: [],
  defaultVariants: {
    size: "medium",
  },
});
