import React from "react";
import { StyledTable, PaginationWrapper, TableWrapper, EmptyHeader, EmptyText } from "./Table.styles";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    PaginationState,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { useQuery } from "react-query";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import Pagination from "rc-pagination";
import { StyledEmpty } from "../Table/Table.styles";

interface ITableProps {
    selectedRowId?: number | null;
    alternate?: boolean;
    alternateHover?: boolean;
    className?: string;
    scroll?: any;
    columnsData: any[];
    sortable?: boolean;
    paginate?: boolean;
    fullPagination?: boolean;
    showPageSizeChanger?: boolean;
    dataFetchFunction?: (options: { pageIndex?: number; pageSize?: number }) => any;
    rowClick?: (props: any) => any;
}

function Table({
    columnsData,
    sortable = false,
    paginate = true,
    fullPagination = true,
    showPageSizeChanger = true,
    dataFetchFunction,
    rowClick,
}: ITableProps) {
    const columns: any[] = [];
    const columnHelper = createColumnHelper();
    columnsData.map((item) => {
        columns.push(
            columnHelper.accessor(item.key, {
                cell: item.render ? item.render : (info) => info.getValue(),
                header: item.title ?? item.dataIndex,
            }),
        );
    });

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 1,
        pageSize: 100,
    });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    };

    const dataQuery = useQuery(
        ["data", fetchDataOptions],
        () =>
            dataFetchFunction &&
            (paginate ? dataFetchFunction({ pageIndex: pageIndex - 1, pageSize }) : dataFetchFunction({})),
        {
            keepPreviousData: true,
        },
    );
    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data: dataQuery.data?.rows ?? [],
        columns,
        pageCount: dataQuery.data?.pageCount ?? -1,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            pagination,
        },
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        manualPagination: true,
        debugTable: true,
    });

    if (!columns.length || !dataQuery.data?.rows?.length) {
        return (
            <StyledEmpty>
                <EmptyHeader> We could not find it! </EmptyHeader>
                <EmptyText> We are sorry, but your search did not have any result </EmptyText>
            </StyledEmpty>
        );
    }

    const PaginationChange = (pageIndex: number, pageSize: number, currentPageSize?: number) => {
        if (currentPageSize && currentPageSize < pageSize)
            pageIndex = Math.ceil(pageIndex * (currentPageSize / pageSize));
        setPagination({ pageIndex, pageSize });
    };

    const PrevNextArrow = (_page: any, type: string, originalElement: any) => {
        if (type === "prev") {
            return (
                <button>
                    <ChevronLeftIcon />
                </button>
            );
        }
        if (type === "next") {
            return (
                <button>
                    <ChevronRightIcon />
                </button>
            );
        }
        return originalElement;
    };

    return (
        <StyledTable>
            <TableWrapper>
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
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} onClick={() => (rowClick ? rowClick(row) : "")}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableWrapper>
            {paginate && (
                <PaginationWrapper>
                    {fullPagination && (
                        <Pagination
                            className="pagination-data"
                            onChange={PaginationChange}
                            total={dataQuery.data?.total}
                            current={pageIndex}
                            pageSize={pageSize}
                            itemRender={PrevNextArrow}
                            locale={{
                                // Options.jsx
                                items_per_page: "/ page",
                                jump_to: "Go to",
                                jump_to_confirm: "confirm",
                                page: "Page",
                                // Pagination.jsx
                                prev_page: "Previous Page",
                                next_page: "Next Page",
                                prev_3: "Previous 3 Pages",
                                next_3: "Next 3 Pages",
                            }}
                        />
                    )}
                    {!fullPagination && (
                        <>
                            <button
                                className="pagination-item"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="navIcon">
                                    <ChevronLeftIcon />
                                </span>
                            </button>
                            <button
                                className="pagination-item"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="navIcon">
                                    <ChevronRightIcon />
                                </span>
                            </button>
                        </>
                    )}
                    {showPageSizeChanger && (
                        <select
                            className="pageSizeSelector"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                PaginationChange(pageIndex, Number(e.target.value), pageSize);
                            }}
                        >
                            {[100, 200, 500, 1000].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} / page
                                </option>
                            ))}
                        </select>
                    )}
                </PaginationWrapper>
            )}
        </StyledTable>
    );
}

export default Table;
