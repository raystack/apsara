import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";

export const StyledTooltip = styled(({ className, tooltipClassName, ...props }) => (
    <Tooltip {...props} className={tooltipClassName} overlayClassName={className} />
))`
    .ant-tooltip-inner {
        min-width: unset;
        min-height: unset;
        font-size: 11px;
        padding: 4px 8px;
        color: ${({ theme }) => theme?.tooltip?.text};
        background-color: ${({ theme }) => theme?.tooltip?.bg};
    }
    .ant-tooltip-arrow-content {
        background-color: ${({ theme }) => theme?.tooltip?.bg};
    }
`;
