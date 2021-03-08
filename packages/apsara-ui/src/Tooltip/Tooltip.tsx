import React from "react";
import { Tooltip } from "antd";
import "./style.less";
import { TooltipProps } from "antd/lib/tooltip";

const CustomTooltip = ({ className = "", ...props }: TooltipProps) => (
    <Tooltip {...props} overlayClassName={`skeleton-tooltip ${className}`} />
);

export default CustomTooltip;
