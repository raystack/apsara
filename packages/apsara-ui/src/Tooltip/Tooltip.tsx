import React, { HTMLAttributes } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import { TooltipContent } from "./Tooltip.styles";

export type TooltipPlacement = "left" | "right" | "top" | "bottom";

export type TooltipProps = {
    title?: React.ReactNode;
    placement?: TooltipPlacement;
    style?: React.CSSProperties;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: ((open: boolean) => void) | undefined;
    delayDuration?: number;
    avoidCollisions?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Tooltip = ({
    title = "",
    placement = "right",
    delayDuration = 100,
    style,
    children,
    defaultOpen,
    open,
    onOpenChange,
    avoidCollisions,
    ...props
}: TooltipProps) => {
    return (
        <RadixTooltip.Provider delayDuration={delayDuration}>
            <RadixTooltip.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
                <RadixTooltip.Trigger asChild>
                    <span>{children}</span>
                </RadixTooltip.Trigger>
                <TooltipContent className="TooltipContent" sideOffset={5} side={placement} style={style} avoidCollisions={avoidCollisions} {...props}>
                    {title}
                    <RadixTooltip.Arrow className="TooltipArrow" />
                </TooltipContent>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
