import { styled } from "../../stitches.config";

export const Status = styled("div", {
  borderRadius: "50%",
  flexShrink: 0,
  backgroundColor: "$bgBase",

  variants: {
    size: {
      sm: {
        width: 5,
        height: 5,
      },
      md: {
        width: 9,
        height: 9,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
