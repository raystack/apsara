import React, { HTMLAttributes } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { TooltipContentWrapper } from "./Tooltip.styles";

type RenderFunction = () => React.ReactNode;

export type TooltipPlacement = "left" | "right" | "top" | "bottom";

export type TooltipProps = {
    title?: React.ReactNode | RenderFunction | string;
    placement?: TooltipPlacement;
    style?: React.CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

const Tooltip = ({
    title = "",
    placement = "right",
    style = { backgroundColor: "#333", color: "white" },
    children,
    ...props
}: TooltipProps) => {
    return (
        <RadixTooltip.Provider delayDuration={100}>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    <span>{children}</span>
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <TooltipContentWrapper style={style}>
                        <RadixTooltip.Content className="TooltipContent" sideOffset={5} side={placement} {...props}>
                            {title}
                            <RadixTooltip.Arrow className="TooltipArrow" />
                        </RadixTooltip.Content>
                    </TooltipContentWrapper>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
