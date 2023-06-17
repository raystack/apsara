import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled, VariantProps } from "../../stitches.config";

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  boxSizing: "border-box",
  userSelect: "none",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  alignItems: "center",
  appearance: "none",
  display: "inline-flex",
  justifyContent: "center",
  lineHeight: "1",
  margin: "0",
  outline: "none",
  padding: "0",

  color: "#FFF",
  overflow: "hidden",
  border: "1px solid $colors$borderBase",

  "@hover": {
    "&:hover": {
      background: "$bgBaseHover",
      border: "1px solid $colors$borderBaseHover",
    },
  },

  '&[data-state="checked"]': {
    outline: "none",
    border: "none",
    background: "$bgAccentInverted",
  },

  variants: {
    size: {
      "1": {
        width: "$3",
        height: "$3",
        borderRadius: "$1",
      },
      "2": {
        width: "$5",
        height: "$5",
        borderRadius: "$2",
      },
    },
  },
  defaultVariants: {
    size: "1",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  alignItems: "center",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  width: "100%",
});

type CheckboxPrimitiveProps = React.ComponentProps<
  typeof CheckboxPrimitive.Root
>;
type CheckboxVariants = VariantProps<typeof StyledCheckbox>;
type CheckboxProps = CheckboxPrimitiveProps & CheckboxVariants & { css?: CSS };

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof StyledCheckbox>,
  CheckboxProps
>((props, forwardedRef) => (
  <StyledCheckbox {...props} ref={forwardedRef}>
    <StyledIndicator>
      <CheckIcon />
    </StyledIndicator>
  </StyledCheckbox>
));
