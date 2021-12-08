import styled from "styled-components";
import { Badge, BadgeProps } from "antd";
import Button from "../../Button";
import { textStyles } from "../../mixin";

export const FilterPopup = styled.div`
    ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.listing?.filterText)}
    display: flex;
    margin: -12px -16px;
    flex-direction: column;

    ::-webkit-scrollbar {
        width: 0;
    }
`;

export const FilterBody = styled.div`
    display: flex;
    flex-direction: row;
`;

export const FilterColumn = styled.div`
    min-width: 162px;
    padding: 16px 24px 2px 24px;

    &:not(:last-child) {
        border-right: 1px solid ${({ theme }) => theme?.listing?.filterBorder};
    }
    .ant-checkbox-group {
        overflow-y: auto;
        max-height: 260px;
    }
    .ant-checkbox-wrapper {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.listing?.filterText)}
    }
`;

export const FilterTitle = styled.div`
    font-weight: bold;
    letter-spacing: 0.3px;
    padding-bottom: 10px;
`;

export const FilterLabel = styled.div`
    padding: 6px 0;
`;

export const FilterFooter = styled.div`
    padding: 16px;
    border-top: 1px solid ${({ theme }) => theme?.listing?.filterBorder};
    span {
        cursor: pointer;
        color: ${({ theme }) => theme?.colors?.primary[4]};
        letter-spacing: 0.3px;
        font-weight: bold;
        &.disabled {
            pointer-events: none;
            color: ${({ theme }) => theme?.listing?.filterClear};
        }
    }
`;

export const FilterButton = styled(Button)`
    ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.listing?.filterText)};
    &:hover,
    &:focus,
    &:active {
        border-color: ${({ theme }) => theme?.colors?.black[7]} !important;
    }
    .anticon-caret-down {
        font-size: 10px;
        transform: rotate(0);
        transition: transform 0.5s;
        &.rotate {
            transform: rotate(-180deg) translate(0, 2px);
        }
    }
`;

export const StyledBadge: React.FC<BadgeProps> = styled(Badge)`
    .ant-badge-dot {
        background: ${({ theme }) => theme?.colors?.primary[4]};
    }
`;
