import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import React from "react";
import { CSS, styled, VariantProps } from "~/stitches.config";

export const RadioRoot = styled(RadioGroupPrimitive.Root, {
    display: "flex",
});

const StyledIndicator = styled(RadioGroupPrimitive.Indicator, {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    "&::after": {
        content: '""',
        display: "block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: "$fgInverted",
    },
});

const StyledRadio = styled(RadioGroupPrimitive.Item, {
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
    textDecoration: "none",

    borderRadius: "50%",
    border: "1px solid $colors$borderBase",

    overflow: "hidden",
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
            },
            "2": {
                width: "$5",
                height: "$5",

                [`& ${StyledIndicator}`]: {
                    "&::after": {
                        width: "$3",
                        height: "$3",
                    },
                },
            },
        },
    },
    defaultVariants: {
        size: "1",
    },
});

type RadioVariants = VariantProps<typeof StyledRadio>;
type RadioGroupItemPrimitiveProps = React.ComponentProps<typeof RadioGroupPrimitive.Item>;
type RadioProps = RadioGroupItemPrimitiveProps & RadioVariants & { css?: CSS };

const RadioItem = React.forwardRef<React.ElementRef<typeof StyledRadio>, RadioProps>((props, forwardedRef) => (
    <StyledRadio {...props} ref={forwardedRef}>
        <StyledIndicator />
    </StyledRadio>
));

export const Radio = Object.assign(RadioRoot, {
    Indicator: StyledIndicator,
    Item: RadioItem,
});
