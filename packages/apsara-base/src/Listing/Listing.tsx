/* eslint-disable no-param-reassign */
import React from "react";
import Search from "../Search";
import Filters from "./Filters";
import { ListLoader } from "../Loader";
import VirtualisedTable from "../Table/VirtualisedTable";
import useSearchFilter from "./useSearchFilter";

interface ListingProps {
    list: any[];
    loading: boolean;
    resourceName?: string;
    resourcePath?: string;
    rowKey?: string;
    className?: string;
    tableProps: { getColumnList: any; handleRowClick?: () => null; selectedRowId?: number };
    filterProps: { filterFieldList: any[] };
    searchProps: { searchPlaceholder?: string; searchFields: any[]; disabled?: boolean };
    renderExtraFilters?: any;
    renderHeader?: any;
    renderBody?: any;
}

const Listing = ({
    list = [],
    loading = false,
    rowKey,
    className = "",
    filterProps: { filterFieldList = [] },
    searchProps: { searchFields = [], disabled = false, searchPlaceholder, ...extraSearchProps },
    tableProps: { getColumnList = () => [], handleRowClick = () => null, selectedRowId, ...extraTableProps },
    renderExtraFilters = null,
    renderHeader = null,
    renderBody = null,
    resourcePath = "/",
}: ListingProps) => {
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
            />
        );
    }
    return (
        <div className={`Listing ${className}`}>
            {renderHeader}
            {renderBody}
        </div>
    );
};

export default Listing;
