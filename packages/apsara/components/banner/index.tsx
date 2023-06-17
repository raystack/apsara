import { styled } from "../../stitches.config";

export const Banner = styled("div", {
  // Reset
  boxSizing: "border-box",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "$3",

  variants: {
    size: {
      "1": {
        py: "$1",
        px: "$4",
      },
    },

    rounded: {
      true: {
        borderRadius: "$pill",
      },
    },
    border: {
      true: {
        borderRadius: "$pill",
      },
    },
  },
  defaultVariants: {
    size: "1",
  },
});
