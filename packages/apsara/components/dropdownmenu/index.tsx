import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { itemCss, labelCss, menuCss, separatorCss } from "../menu";
import { panelStyles } from "../panel";

const StyledContent = styled(
  DropdownMenuPrimitive.Content,
  menuCss,
  panelStyles,
  {
    zIndex: 50,
    borderRadius: "2px",
  }
);

type DropdownMenuContentPrimitiveProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
>;
export type DropdownMenuContentProps = DropdownMenuContentPrimitiveProps & {
  css?: CSS;
};

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof StyledContent>,
  DropdownMenuContentProps
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Portal>
    <StyledContent {...props} ref={forwardedRef} />
  </DropdownMenuPrimitive.Portal>
));

const DropdownMenuItem = styled(DropdownMenuPrimitive.Item, itemCss);
const DropdownMenuGroup = styled(DropdownMenuPrimitive.Group, {
  padding: "$2 $2",
});
const DropdownMenuLabel = styled(DropdownMenuPrimitive.Label, labelCss);
const DropdownMenuSeparator = styled(
  DropdownMenuPrimitive.Separator,
  separatorCss
);

const DropdownMenuPrimitiveRoot = styled(DropdownMenuPrimitive.Root, {});
export const DropdownMenu = Object.assign(DropdownMenuPrimitiveRoot, {
  Trigger: DropdownMenuPrimitive.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
});
