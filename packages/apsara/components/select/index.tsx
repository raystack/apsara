import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled } from "../../stitches.config";

const SelectWrapper = styled("div", {
  backgroundColor: "$bgBase",
  borderRadius: "$1",
  color: "$fgBase",
  fontSize: "$2",
  fontVariantNumeric: "tabular-nums",
  fontWeight: 400,
  flexShrink: 0,
  position: "relative",
  "&:focus-within": {
    zIndex: 1,
  },
});

const StyledSelect = styled("select", {
  font: "inherit",
  width: "100%",
  height: "100%",
  padding: "$1",
  paddingLeft: "$3",
  paddingRight: "$6",

  appearance: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
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
  fontSize: "$2",

  lineHeight: "$sizes$4",

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
});

const StyledCaretSortIcon = styled(ChevronDownIcon, {
  position: "absolute",
  pointerEvents: "none",
  display: "inline",
  width: 12,
  height: 12,

  // Use margins instead of top/left to avoid setting "position: relative" on parent,
  // which would make stacking context tricky with Select used in a control group.
  marginTop: 6,
  marginLeft: -18,
});

type SelectProps = React.ComponentProps<typeof StyledSelect> & { css?: CSS };

export const Select = React.forwardRef<
  React.ElementRef<typeof StyledSelect>,
  SelectProps
>(({ css, size, ...props }, forwardedRef) => (
  <SelectWrapper css={css}>
    <StyledSelect ref={forwardedRef} size={size} {...props} />
    <StyledCaretSortIcon />
  </SelectWrapper>
));

Select.toString = () => `.${SelectWrapper.className}`;
