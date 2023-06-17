import { styled } from "../../stitches.config";
import { Button } from "../button";
import { Select } from "../select";
import { TextField } from "../textfield";

export const ControlGroup = styled("div", {
  display: "flex",

  // Make sure ControlGroup and its children don't affect normal stacking order
  position: "relative",
  zIndex: 0,

  [`& ${Button}`]: {
    borderRadius: 0,

    "&:focus": {
      zIndex: 1,
    },
    "&:first-child": {
      borderTopLeftRadius: "$1",
      borderBottomLeftRadius: "$1",
    },
    "&:last-child": {
      borderTopRightRadius: "$1",
      borderBottomRightRadius: "$1",
    },
  },
  [`& ${TextField}`]: {
    borderRadius: 0,
    "&:focus": {
      zIndex: 1,
    },
    "&:first-child": {
      borderTopLeftRadius: "$1",
      borderBottomLeftRadius: "$1",
    },
    "&:last-child": {
      borderTopRightRadius: "$1",
      borderBottomRightRadius: "$1",
    },
  },
  [`& ${Select}`]: {
    borderRadius: 0,

    "&:first-child": {
      borderTopLeftRadius: "$1",
      borderBottomLeftRadius: "$1",
    },
    "&:last-child": {
      borderTopRightRadius: "$1",
      borderBottomRightRadius: "$1",
    },
  },
});
