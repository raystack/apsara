import { styled } from "../../stitches.config";

export const Card = styled("div", {
  appearance: "none",
  boxSizing: "border-box",
  font: "inherit",
  lineHeight: "1",
  outline: "none",
  textAlign: "inherit",
  verticalAlign: "middle",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",

  backgroundColor: "$bgBase",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  textDecoration: "none",
  color: "inherit",
  flexShrink: 0,
  padding: "$4",
  borderRadius: "$1",
  border: "1px solid $borderBase",
  position: "relative",

  "&::before": {
    boxSizing: "border-box",
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: "$1",
    pointerEvents: "none",
  },

  variants: {
    variant: {
      interactive: {
        "@hover": {
          "&:hover": {
            "&::before": {
              boxShadow: "0px 0px 6px 1px #E2E2E2",
            },
          },
        },
        "&:focus": {
          "&::before": {
            boxShadow: "0px 0px 6px 1px #E2E2E2",
          },
        },
      },
      ghost: {
        backgroundColor: "transparent",
        transition:
          "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 25ms linear",
        willChange: "transform",
        "&::before": {
          boxShadow: "0px 0px 6px 1px #E2E2E2",
          opacity: "0",
          transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        },
        "@hover": {
          "&:hover": {
            backgroundColor: "$bgBase",
            transform: "translateY(-2px)",
            "&::before": {
              opacity: "1",
            },
          },
        },
        "&:active": {
          transform: "translateY(0)",
          transition: "none",
          "&::before": {
            boxShadow: "0px 0px 6px 1px #E2E2E2",
            opacity: "1",
          },
        },
        "&:focus": {
          boxShadow: "0px 0px 6px 1px #E2E2E2",
        },
      },
      active: {
        transform: "translateY(0)",
        transition: "none",
        "&::before": {
          boxShadow: "0px 0px 6px 1px #E2E2E2",
          opacity: "1",
        },
        "&:focus": {
          boxShadow: "0px 0px 6px 1px #E2E2E2",
        },
      },
    },
  },
});
