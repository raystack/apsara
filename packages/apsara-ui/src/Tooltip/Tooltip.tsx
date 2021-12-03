import React from "react";
import { TooltipProps } from "antd";
import { StyledTooltip } from "./Tooltip.styles";

const CustomTooltip: React.FC<TooltipProps> = ({ className = "", ...props }) => (
    <StyledTooltip {...props} tooltipClassName={className} />
);

export default CustomTooltip;
