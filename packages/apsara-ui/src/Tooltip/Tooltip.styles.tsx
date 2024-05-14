import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export const TooltipContent = styled(RadixTooltip.Content)`
    --tooltip-color: ${({ style }) => style?.color};
    --tooltip-background-color: ${({ style }) => style?.backgroundColor};
    color: var(--tooltip-color);
    background-color: var(--tooltip-background-color);
    padding: 4px 8px;
    width: max-content;
    max-width: 250px;
    border-radius: 2px;
    text-align: left;
    font-size: 11px;
    font-family: Roboto;
    font-weight: 200;
    background-color: #333;
    color: white;

    .TooltipArrow {
        --tooltip-background-color: ${({ style }) => style?.backgroundColor};
        fill: var(--tooltip-background-color);
    }
`;
