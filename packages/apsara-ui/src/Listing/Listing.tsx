/* eslint-disable no-param-reassign */
import React from "react";
import Filters from "./Filters";
import VirtualisedTable from "../TableV2/VirtualisedTable";
import useSearchFilter from "./hooks/useSearchFilter";
import { ListingProps } from "./Listing.types";
import { ListingSearch, ListingWrapper } from "./Listing.styles";

const Listing = ({
    rowKey,
    className = "",
    list = [],
    filterProps = {},
    searchProps = {},
    tableProps = {},
    renderHeader = null,
    renderBody = null,
    renderExtraFilters = null,
    resourcePath = "/",
    calculateRowHeight,
    calculateColumnWidth,
    rowClick,
    sortable = false,
}: ListingProps) => {
    const { getColumnList = () => [], selectedRowId, ...extraTableProps } = tableProps;
    const { searchFields = [], disabled = false, searchPlaceholder, ...extraSearchProps } = searchProps;
    const { filterFieldList } = filterProps;
    const {
        searchTerm,
        sortedInfo,
        setSearchTerm,
        onGroupFilter,
        onClearGroupFilter,
        filteredList,
        filteredFieldData,
    } = useSearchFilter({ list, searchFields });

    const columns = getColumnList(resourcePath, sortedInfo);
    if (!renderHeader) {
        renderHeader = (
            <ListingSearch
                onChange={({ target: { value } }: any) => setSearchTerm(value)}
                value={searchTerm}
                placeholder={searchPlaceholder}
                disabled={disabled}
                {...extraSearchProps}
            >
                {filterFieldList && (
                    <Filters
                        disabled={disabled}
                        filterFieldList={filterFieldList || []}
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
                items={filteredList}
                columnsData={columns}
                rowKey={rowKey}
                selectedRowId={selectedRowId}
                rowClick={rowClick}
                calculateRowHeight={calculateRowHeight}
                calculateColumnWidth={calculateColumnWidth}
                sortable={sortable}
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

export default Listing;
