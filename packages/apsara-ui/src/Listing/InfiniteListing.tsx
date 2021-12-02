/* eslint-disable no-param-reassign */
import React, { useEffect } from "react";
import Filters from "./Filters";
import { ListLoader } from "../Loader";
import VirtualisedTable from "../Table/VirtualisedTable";
import { useSearchFilterState } from "./hooks/useSearchFilter";
import { ListingSearch, ListingWrapper } from "./Listing.styles";

interface ILoadMoreProps {
    nextPage: number;
    search: string;
    filters: unknown;
}

interface InfiniteListingProps {
    list?: any[];
    loading?: boolean;
    resourcePath?: string;
    rowKey?: string;
    className?: string;
    tableProps?: {
        getColumnList?: any;
        handleRowClick?: (event: any, rowIndexData: any) => void;
        selectedRowId?: number;
        scroll?: any;
    };
    filterProps?: { filterFieldList?: any[] };
    searchProps?: { searchPlaceholder?: string; disabled?: boolean };
    renderExtraFilters?: any;
    renderHeader?: any;
    renderBody?: any;
    page?: number;
    loadMore: (data: ILoadMoreProps) => Promise<void> | null;
    onSearch: (data: ILoadMoreProps) => void | null;
    onFilter: (data: ILoadMoreProps) => void | null;
}

const InfiniteListing = ({
    list = [],
    loading = false,
    rowKey,
    className = "",
    filterProps = {},
    searchProps = {},
    tableProps = {},
    renderExtraFilters = null,
    renderHeader = null,
    renderBody = null,
    resourcePath = "/",
    page = 1,
    loadMore = () => null,
    onSearch = () => null,
    onFilter = () => null,
}: InfiniteListingProps) => {
    const { getColumnList = () => [], handleRowClick = () => ({}), selectedRowId, ...extraTableProps } = tableProps;
    const { filterFieldList = [] } = filterProps;

    const {
        sortedInfo,
        searchTerm,
        filteredFieldData,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
    } = useSearchFilterState();
    const { disabled = false, searchPlaceholder, ...extraSearchProps } = searchProps || {};
    async function handleLoadMore() {
        await loadMore({ nextPage: page + 1, search: searchTerm, filters: filteredFieldData });
    }

    function handleSearch({ target: { value } }: any) {
        setSearchTerm(value);
        onSearch({
            nextPage: page + 1,
            search: value,
            filters: filteredFieldData,
        });
    }

    useEffect(() => {
        onFilter({ nextPage: page + 1, search: searchTerm, filters: filteredFieldData });
    }, [filteredFieldData]);

    const columns = getColumnList(resourcePath, sortedInfo);

    if (loading) return <ListLoader className={className} />;

    if (!renderHeader) {
        renderHeader = (
            <ListingSearch
                onChange={handleSearch}
                value={searchTerm}
                placeholder={searchPlaceholder}
                disabled={disabled}
                {...extraSearchProps}
            >
                {filterFieldList && (
                    <Filters
                        disabled={disabled}
                        filterFieldList={filterFieldList}
                        filteredFieldData={filteredFieldData}
                        onGroupFilter={onGroupFilter}
                        onClearGroupFilter={onClearGroupFilter}
                    />
                )}
                {renderExtraFilters}
            </ListingSearch>
        );
    }

    if (!renderBody) {
        renderBody = (
            <VirtualisedTable
                items={list}
                columns={columns}
                rowKey={rowKey}
                selectedRowId={selectedRowId}
                onChange={(_pagination, _filters, sorter) => setSortedInfo(sorter)}
                onRowClick={handleRowClick}
                loadMore={handleLoadMore}
                {...extraTableProps}
            />
        );
    }
    return (
        <ListingWrapper className={className}>
            {renderHeader}
            {renderBody}
        </ListingWrapper>
    );
};

export default InfiniteListing;
