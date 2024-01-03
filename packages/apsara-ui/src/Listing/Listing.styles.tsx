import styled from "styled-components";
import Search, { SearchProps } from "../Search/Search";

export const ListingWrapper = styled.div`
    height: 100%;
    .virtual-table-row-hover {
        background: ${({ theme }) => theme?.listing?.tableHighlight} !important;
    }
`;

export const ListingSearch: React.FC<SearchProps> = styled(Search)`
    margin-bottom: 20px;
    .search_input {
        margin-right: 10px !important;
    }
`;

export const FilterActions = styled.span`
    display: flex;
    align-items: center;
`;
