import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { itemCss, labelCss, menuCss, separatorCss } from "../menu";
import { panelStyles } from "../panel";

const StyledContent = styled(ContextMenuPrimitive.Content, menuCss, panelStyles, {
    zIndex: 50,
});

type ContextMenuContentPrimitiveProps = React.ComponentProps<typeof ContextMenuPrimitive.Content>;
type ContextMenuContentProps = ContextMenuContentPrimitiveProps & { css?: CSS };

const ContextMenuContent = React.forwardRef<React.ElementRef<typeof StyledContent>, ContextMenuContentProps>(
    (props, forwardedRef) => (
        <ContextMenuPrimitive.Portal>
            <StyledContent {...props} ref={forwardedRef} />
        </ContextMenuPrimitive.Portal>
    ),
);

const ContextMenuItem = styled(ContextMenuPrimitive.Item, itemCss);
const ContextMenuGroup = styled(ContextMenuPrimitive.Group, {
    padding: "$2 $3",
});
const ContextMenuLabel = styled(ContextMenuPrimitive.Label, labelCss);
const ContextMenuSeparator = styled(ContextMenuPrimitive.Separator, separatorCss);

const ContextMenuPrimitiveRoot = styled(ContextMenuPrimitive.Root, {});
export const ContextMenu = Object.assign(ContextMenuPrimitiveRoot, {
    Trigger: ContextMenuPrimitive.Trigger,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    Group: ContextMenuGroup,
    Label: ContextMenuLabel,
    Separator: ContextMenuSeparator,
});
