import * as PopoverPrimitive from "@radix-ui/react-popover";
import React from "react";
import { CSS, styled } from "../../stitches.config";
import { Box } from "../box";
import { panelStyles } from "../panel";

const StyledContent = styled(PopoverPrimitive.Content, panelStyles, {
    minWidth: 200,
    minHeight: "$6",
    maxWidth: 265,

    "&:focus": {
        outline: "none",
    },
});

type PopoverContentPrimitiveProps = React.ComponentProps<typeof PopoverPrimitive.Content>;
type PopoverContentProps = PopoverContentPrimitiveProps & { css?: CSS; hideArrow?: boolean };

const PopoverContent = React.forwardRef<React.ElementRef<typeof StyledContent>, PopoverContentProps>(
    ({ children, hideArrow, ...props }, fowardedRef) => (
        <PopoverPrimitive.Portal>
            <StyledContent sideOffset={0} {...props} ref={fowardedRef}>
                {children}
                {!hideArrow && (
                    <Box css={{ color: "$borderMuted" }}>
                        <PopoverPrimitive.Arrow width={11} height={5} style={{ fill: "currentColor" }} />
                    </Box>
                )}
            </StyledContent>
        </PopoverPrimitive.Portal>
    ),
);

const PopoverPrimitiveRoot = styled(PopoverPrimitive.Root, {});
export const Popover = Object.assign(PopoverPrimitiveRoot, {
    Trigger: PopoverPrimitive.Trigger,
    Content: PopoverContent,
    Close: PopoverPrimitive.Close,
});
