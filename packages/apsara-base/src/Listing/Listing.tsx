/* eslint-disable no-param-reassign */
import React from "react";
import Search from "../Search";
import Filters from "./Filters";
import { ListLoader } from "../Loader";
import VirtualisedTable from "../Table";
import useSearchFilter from "./useSearchFilter";

interface ListingProps {
    list: any[];
    loading: boolean;
    getColumnList: any;
    filterFieldList: any[];
    searchFields: any;
    resourceName?: string;
    resourcePath?: string;
    rowKey?: string;
    wrapLink?: boolean;
    handleRowClick?: () => null;
    searchPlaceholder?: string;
    className?: string;
    selectedRowId?: number;
    disabled?: boolean;
    extraTableProps?: any;
    renderExtraFilters?: any;
    renderHeader?: any;
    renderBody?: any;
}

const Listing = ({
    list = [],
    loading = false,
    getColumnList = () => [],
    filterFieldList,
    rowKey,
    wrapLink = true,
    handleRowClick = () => null,
    searchFields,
    searchPlaceholder,
    className = "",
    selectedRowId,
    extraTableProps = {},
    disabled = false,
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

    // ? this wraps a link on the whole row so that user can open resources on a new tab
    // ? recommended way to wrap a link on a table row is to wrap each column with a link ie: <td> <a> {children} </a></td>
    if (wrapLink) {
        columns.forEach((column: any) => {
            const { render: childRender } = column;
            // eslint-disable-next-line no-param-reassign
            column.render = (text: string, rowData: any) => (childRender ? childRender(text, rowData) : text);
        });
    }

    if (loading) return <ListLoader className={className} />;

    if (!renderHeader) {
        renderHeader = (
            <Search
                className="paddingBottom"
                onChange={({ target: { value } }: any) => setSearchTerm(value)}
                value={searchTerm}
                placeholder={searchPlaceholder}
                disabled={disabled}
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
