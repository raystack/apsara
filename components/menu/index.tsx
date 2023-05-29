import { CheckIcon } from "@radix-ui/react-icons";
import * as MenuPrimitive from "@radix-ui/react-menu";
import React from "react";
import { css, CSS, styled } from "~/stitches.config";
import { Box } from "../box";
import { Flex } from "../flex";
import { panelStyles } from "../panel";

export const baseItemCss = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "$2",
    lineHeight: "16px",
    fontVariantNumeric: "tabular-nums",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
});

export const itemCss = css(baseItemCss, {
    position: "relative",
    color: "$gray12",
    padding: "$1 $2",

    "&[data-highlighted]": {
        outline: "none",
        color: "$primary9",
    },

    "&[data-disabled]": {
        color: "$slate9",
    },
});

export const labelCss = css(baseItemCss, {
    color: "$slate11",
    fontSize: "$1",
});

export const menuCss = css({
    boxSizing: "border-box",
    minWidth: 120,
    py: "$1",
});

export const separatorCss = css({
    height: 1,
    my: "$1",
    backgroundColor: "$slate6",
});

const MenuRoot = styled(MenuPrimitive.Root, menuCss);
const MenuContent = styled(MenuPrimitive.Content, panelStyles);

const MenuSeparator = styled(MenuPrimitive.Separator, separatorCss);

const MenuItem = styled(MenuPrimitive.Item, itemCss);

const StyledMenuRadioItem = styled(MenuPrimitive.RadioItem, itemCss);

type MenuRadioItemPrimitiveProps = React.ComponentProps<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = MenuRadioItemPrimitiveProps & { css?: CSS };

const MenuRadioItem = React.forwardRef<React.ElementRef<typeof StyledMenuRadioItem>, MenuRadioItemProps>(
    ({ children, ...props }, forwardedRef) => (
        <StyledMenuRadioItem {...props} ref={forwardedRef}>
            <Box as="span" css={{ position: "absolute", left: "$1" }}>
                <MenuPrimitive.ItemIndicator>
                    <Flex css={{ width: "$3", height: "$3", alignItems: "center", justifyContent: "center" }}>
                        <Box
                            css={{
                                width: "$1",
                                height: "$1",
                                backgroundColor: "currentColor",
                                borderRadius: "$round",
                            }}
                        ></Box>
                    </Flex>
                </MenuPrimitive.ItemIndicator>
            </Box>
            {children}
        </StyledMenuRadioItem>
    ),
);

const StyledMenuCheckboxItem = styled(MenuPrimitive.CheckboxItem, itemCss);

type MenuCheckboxItemPrimitiveProps = React.ComponentProps<typeof MenuPrimitive.CheckboxItem>;
type MenuCheckboxItemProps = MenuCheckboxItemPrimitiveProps & { css?: CSS };

const MenuCheckboxItem = React.forwardRef<React.ElementRef<typeof StyledMenuCheckboxItem>, MenuCheckboxItemProps>(
    ({ children, ...props }, forwardedRef) => (
        <StyledMenuCheckboxItem {...props} ref={forwardedRef}>
            <Box as="span" css={{ position: "absolute", left: "-$4" }}>
                <MenuPrimitive.ItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.ItemIndicator>
            </Box>
            {children}
        </StyledMenuCheckboxItem>
    ),
);

const MenuLabel = styled(MenuPrimitive.Label, labelCss);
const MenuRadioGroup = styled(MenuPrimitive.RadioGroup, {});
const MenuGroup = styled(MenuPrimitive.Group, {});

export const Menu = Object.assign(MenuRoot, {
    Content: MenuContent,
    Separator: MenuSeparator,
    Item: MenuItem,
    RadioItem: MenuRadioItem,
    CheckboxItem: MenuCheckboxItem,
    Label: MenuLabel,
    Group: MenuGroup,
    RadioGroup: MenuRadioGroup,
});
