import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { StyledTable, TableWrapper } from "./Table.styles";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { useVirtual } from "react-virtual";
import { useInfiniteQuery } from "react-query";

interface ITableProps {
    selectedRowId?: number | null;
    alternate?: boolean;
    alternateHover?: boolean;
    className?: string;
    scroll?: any;
    columnsData: any[];
    sortable?: boolean;
    dataFetchFunction: (
        start: number,
        size: number,
        sorting: SortingState,
    ) => { data: any[]; meta: { totalRowCount: number } };
    fetchSize?: number;
}

function VirtualisedTableWithInfiniteScroll({
    columnsData,
    sortable = false,
    dataFetchFunction,
    fetchSize = 10,
}: ITableProps) {
    const columns: any[] = [];
    const columnHelper = createColumnHelper();
    columnsData.map((item) => {
        columns.push(
            columnHelper.accessor(item.key, {
                cell: (info) => info.getValue(),
                header: item.title ?? item.dataIndex,
            }),
        );
    });

    const [sorting, setSorting] = useState<SortingState>([]);

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, isFetching } = useInfiniteQuery(
        ["table-data", sorting],
        async ({ pageParam = 0 }) => {
            const start = pageParam * fetchSize;
            const fetchedData = dataFetchFunction(start, fetchSize, sorting);
            return fetchedData;
        },
        {
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        },
    );

    const flatData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
    const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
    const totalFetched = flatData.length;

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching && totalFetched < totalDBRowCount) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    });
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

    return (
        <StyledTable>
            <TableWrapper
                className="container"
                onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}
            >
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="table-cell">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                                {...(sortable && {
                                                    className: header.column.getCanSort()
                                                        ? "cursor-pointer select-none"
                                                        : "",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                })}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}

                                                {(sortable &&
                                                    {
                                                        asc: (
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <TriangleUpIcon color="#1890ff" />
                                                                <TriangleDownIcon />
                                                            </div>
                                                        ),
                                                        desc: (
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <TriangleUpIcon />
                                                                <TriangleDownIcon color="#1890ff" />
                                                            </div>
                                                        ),
                                                    }[header.column.getIsSorted() as string]) ?? (
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <TriangleUpIcon />
                                                        <TriangleDownIcon />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} />
                            </tr>
                        )}
                        {virtualRows.map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </TableWrapper>
        </StyledTable>
    );
}

export default VirtualisedTableWithInfiniteScroll;
