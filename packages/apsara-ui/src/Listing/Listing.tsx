/* eslint-disable no-param-reassign */
import React from "react";
import Search from "../Search";
import Filters from "./Filters";
import VirtualisedTable from "../Table/VirtualisedTable";
import useSearchFilter from "./hooks/useSearchFilter";
import clsx from "clsx";
import { ListingProps } from "./Listing.types";

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
}: ListingProps) => {
    const { getColumnList = () => [], handleRowClick = () => null, selectedRowId, ...extraTableProps } = tableProps;
    const { searchFields = [], disabled = false, searchPlaceholder, ...extraSearchProps } = searchProps;
    const { filterFieldList } = filterProps;
    const {
        searchTerm,
        sortedInfo,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
        filteredList,
        filteredFieldData,
    } = useSearchFilter({ list, searchFields });

    const columns = getColumnList(resourcePath, sortedInfo);
    if (!renderHeader) {
        renderHeader = (
            <Search
                className="paddingBottom"
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
            </Search>
        );
    }

    if (!renderBody) {
        renderBody = (
            <VirtualisedTable
                items={filteredList}
                columns={columns}
                rowKey={rowKey}
                selectedRowId={selectedRowId}
                onChange={(_pagination, _filters, sorter) => setSortedInfo(sorter)}
                onRowClick={handleRowClick}
                calculateRowHeight={calculateRowHeight}
                calculateColumnWidth={calculateColumnWidth}
                {...extraTableProps}
            />
        );
    }
    return (
        <div className={clsx("Listing", className)}>
            {renderHeader}
            {renderBody}
        </div>
    );
};

export default Listing;
