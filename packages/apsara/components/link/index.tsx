import { styled } from "../../stitches.config";
import { Text } from "../text";

export const Link = styled("a", {
  alignItems: "center",
  gap: "$1",
  flexShrink: 0,
  outline: "none",
  textDecorationLine: "none",
  textUnderlineOffset: "3px",
  textDecorationColor: "$fgSubtle",
  lineHeight: "inherit",
  "@hover": {
    "&:hover": {
      textDecorationLine: "underline",
    },
  },
  "&:focus": {
    outlineWidth: "2px",
    outlineStyle: "solid",
    outlineOffset: "2px",
    textDecorationLine: "none",
  },
  [`& ${Text}`]: {
    color: "inherit",
  },
});
