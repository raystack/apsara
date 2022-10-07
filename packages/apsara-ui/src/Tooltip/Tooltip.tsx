import React, { HTMLAttributes } from "react";
import { StyledTooltip } from "./Tooltip.styles";

type RenderFunction = () => React.ReactNode;

export type TooltipProps = {
    title?: React.ReactNode | RenderFunction;
    placement?:
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "rightTop"
        | "rightBottom"
        | "leftTop"
        | "leftBottom"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight";
    color?: string;
    arrowSize?: string;
} & HTMLAttributes<HTMLDivElement>;

const Tooltip = ({
    title = "",
    placement = "top",
    color = "#333",
    children,
    arrowSize = "5px",
    ...props
}: TooltipProps) => {
    return (
        <StyledTooltip data-tooltip={title} placement={placement} color={color} arrowSize={arrowSize} {...props}>
            {children}
        </StyledTooltip>
    );
};

export default Tooltip;
