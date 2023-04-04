import type { ReactElement } from "react";
import { Children, useCallback, useMemo, useRef, useState } from "react";

import type { TableState } from "@tanstack/react-table";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { mergeDeepRight } from "ramda";
import React from "react";
import { useUpdateEffect } from "usehooks-ts";
import { Box } from "~/components/box";
import { EmptyState } from "~/components/emptystate";
import { styled } from "~/stitches.config";
import { TableColumnSelect } from "./filter/TableColumnClearSelection";
import { TableColumnFilterChips } from "./filter/TableColumnFilterChips";
import TableColumnFilterSelection from "./filter/TableColumnFilterSelection";
import TableColumnsFilter from "./filter/TableColumnsViewFilter";
import { TableHeader } from "./header/TableHeader";
import useOnClickOutside from "./hooks/useOnClickOutside";
import { useRowSelection } from "./hooks/useRowSelection";
import { useTableFilter } from "./hooks/useTableFilter";
import { TableGlobalSearch } from "./search/TableGlobalSearch";
import type { TableProps, TableType } from "./Table.types";
import { TableBody } from "./TableBody";
import { TableBottomContainer } from "./TableBottomContainer";
import { TableContext } from "./TableContext";
import { TablePerPage } from "./TablePerPage";
import { TableTopContainer } from "./TableTopContainer";
import { RaypointFilterFns } from "./utils/filterFns";

export const Table: TableType = <T,>({
    css,
    data,
    loading = false,
    initialState = {},
    columns: defaultColumns,
    children,
    getRowId,
    getExpandChildren,
    onMount,
    onChange,
    doubleClickAction,
    multiRowSelectionEnabled,
    isHeaderVisible = true,
    noDataChildren,
    ...options
}: TableProps<T>) => {
    const outsideClickRef = useRef(null);
    const convertedChildren = Children.toArray(children) as ReactElement[];
    const header = convertedChildren.find((child) => child.type === TableTopContainer);
    const footer = convertedChildren.find((child) => child.type === TableBottomContainer);

    const { predicates, ...initialStateValues } = initialState;
    const [orderedcolumns, setOrderedColumns] = useState(defaultColumns);
    const columns = useMemo(() => {
        const _columns = orderedcolumns
            // Hide column for all users using table schema
            .filter((column) => !column.hidden)
            .map((columnConfig) => {
                // @ts-ignore
                columnConfig.filterFn = RaypointFilterFns.raypoint;
                return columnConfig;
            });

        return _columns;
    }, [orderedcolumns]);

    const table = useReactTable({
        initialState: mergeDeepRight(
            { ...initialStateValues, globalFilter: "" },
            {
                pagination: { pageSize: TablePerPage.DEFAULT_SIZE },
            },
        ),
        data,
        // @ts-ignore
        columns: columns,
        manualPagination: true,
        globalFilterFn: "auto",
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        ...options,
    });

    const { clearSelection, getSelectedRow, getSelectedRows } = useRowSelection(table);

    const [state, setState] = useState<TableState>(table.initialState);

    table.setOptions((prev) => ({
        ...prev,
        state,
        onStateChange: setState,
    }));

    useUpdateEffect(() => {
        if (!multiRowSelectionEnabled) {
            clearSelection();
        }
    }, [state.globalFilter, state.sorting, state.pagination]);

    useOnClickOutside(outsideClickRef, () => {
        if (!multiRowSelectionEnabled) {
            clearSelection();
        }
    });

    const { rows } = table.getRowModel();
    const { filterQuery, setFilterQuery, resetQuery } = useTableFilter({
        columns: [],
        state,
        setState,
    });

    // reset table state
    const clearFilters = useCallback(() => {
        setState({
            ...state,
            globalFilter: "",
            columnFilters: [],
        });
        resetQuery();
    }, [resetQuery, state]);

    return (
        <Box ref={outsideClickRef} css={{ width: "100%" }}>
            <TableContext.Provider
                value={{
                    table,
                    state,
                    setState,
                    filterQuery,
                    setFilterQuery,
                    getSelectedRow,
                    getSelectedRows,
                    clearSelection,
                    clearFilters,
                    onChange: () => ({}),
                    containerRef: outsideClickRef,
                    tableColumnsOrdered: orderedcolumns,
                    setTableColumnsOrdered: setOrderedColumns,
                    multiRowSelectionEnabled,
                }}
            >
                {header}
                {!!filterQuery.length && <TableColumnFilterChips />}
                <TableContainer css={css}>
                    {isHeaderVisible && <TableHeader headerGroups={table.getHeaderGroups()} />}
                    {rows.length ? (
                        <TableBody rows={rows} />
                    ) : (
                        <Box as="tbody" css={{ height: "100%" }}>
                            <EmptyState as="tr">
                                <td colSpan={columns.length}>{noDataChildren}</td>
                            </EmptyState>
                        </Box>
                    )}
                </TableContainer>
                {footer}
            </TableContext.Provider>
        </Box>
    );
};

const TableContainer = styled("table", {
    width: "100%",
    padding: 0,
    borderSpacing: 0,
    display: "flex",
    flexDirection: "column",

    "& td:first-of-type, th:first-of-type": {
        paddingLeft: "2.4rem",
    },
    "& tbody td": {
        verticalAlign: "top",
    },
});

Table.TableGlobalSearch = TableGlobalSearch;
Table.TableColumnsFilter = TableColumnsFilter;
Table.TopContainer = TableTopContainer;
Table.BottomContainer = TableBottomContainer;
Table.ColumnSelect = TableColumnSelect;
Table.ColumnFilterSelection = TableColumnFilterSelection;
