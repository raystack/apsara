import styled from "styled-components";
import { DotBadge } from "../../Badge";
import { BadgeProps } from "../../Badge/DotBadge";
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    .clear-btn {
        cursor: pointer;
        color: ${({ theme }) => theme?.colors?.primary[4]};
        letter-spacing: 0.3px;
        font-weight: bold;
        &.disabled {
            pointer-events: none;
            color: ${({ theme }) => theme?.listing?.filterClear};
        }
    }

    .apply-btn {
        margin-left: 10px;
    }
`;

export const FilterButton = styled(Button)`
    ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.listing?.filterText)};
    &:hover,
    &:focus,
    &:active {
        border-color: ${({ theme }) => theme?.colors?.black[7]} !important;
    }
`;

export const StyledBadge: React.FC<BadgeProps> = styled(DotBadge)``;
