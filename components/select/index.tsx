import { CaretSortIcon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled } from "~/stitches.config";

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
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "inherit",
    color: "inherit",
    font: "inherit",
    outline: "none",
    width: "100%",
    height: "100%",
    paddingLeft: "$3",
    paddingRight: "$4",
    lineHeight: "32px",
});

const StyledCaretSortIcon = styled(CaretSortIcon, {
    position: "absolute",
    pointerEvents: "none",
    display: "inline",

    // Use margins instead of top/left to avoid setting "position: relative" on parent,
    // which would make stacking context tricky with Select used in a control group.
    marginTop: 8,
    marginLeft: -16,
});

type SelectProps = React.ComponentProps<typeof StyledSelect> & { css?: CSS };

export const Select = React.forwardRef<React.ElementRef<typeof StyledSelect>, SelectProps>(
    ({ css, ...props }, forwardedRef) => (
        <SelectWrapper css={css}>
            <StyledSelect ref={forwardedRef} {...props} />
            <StyledCaretSortIcon />
        </SelectWrapper>
    ),
);

Select.toString = () => `.${SelectWrapper.className}`;
