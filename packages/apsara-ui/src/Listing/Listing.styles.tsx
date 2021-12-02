import styled from "styled-components";
import Search from "../Search";

export const ListingWrapper = styled.div`
    .virtual-table-row-hover {
        background: #f5f5f5;
    }
`;

export const ListingSearch = styled(Search)`
    padding-bottom: 20px;
`;

export const FilterActions = styled.span`
    display: flex;
    align-items: center;

    & > .anticon {
        padding: 3px 8px;
        border: 1px solid ${({ theme }) => theme?.colors?.black[4]};
        border-radius: 2px;
        border-right: 0;
    }
`;
