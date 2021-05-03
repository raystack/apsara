/* eslint-disable no-param-reassign */
import React from "react";
import Search from "../Search";
import Filters from "./Filters";
import { ListLoader } from "../Loader";
import VirtualisedTable from "../Table/VirtualisedTable";
import useSearchFilter, { IGroupOptions } from "./useSearchFilter";
import clsx from "clsx";

interface ListingProps {
    list?: any[];
    loading?: boolean;
    resourceName?: string;
    resourcePath?: string;
    rowKey?: string;
    className?: string;
    tableProps?: {
        getColumnList?: any;
        handleRowClick?: (event: any, rowIndexData: any) => void;
        selectedRowId?: number;
        scroll?: any;
    };
    filterProps?: { filterFieldList?: IGroupOptions[] };
    searchProps?: { searchPlaceholder?: string; searchFields?: any[]; disabled?: boolean };
    renderExtraFilters?: any;
    renderHeader?: any;
    renderBody?: any;
    calculateRowHeight?: any;
    calculateColumnWidth?: any;
}
const Listing = ({
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
    calculateRowHeight,
    calculateColumnWidth,
}: ListingProps) => {
    const { getColumnList = () => [], handleRowClick = () => null, selectedRowId, ...extraTableProps } = tableProps;
    const { searchFields = [], disabled = false, searchPlaceholder, ...extraSearchProps } = searchProps;
    const { filterFieldList = [] } = filterProps;
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

    if (loading) return <ListLoader className={className} />;

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
                        filterFieldList={filterFieldList}
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
                {...extraTableProps}
                calculateRowHeight={calculateRowHeight}
                calculateColumnWidth={calculateColumnWidth}
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
export { useSearchFilter };
