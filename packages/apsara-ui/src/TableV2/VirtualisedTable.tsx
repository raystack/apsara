import React, { useEffect } from "react";
import { StyledTable, TableWrapper, EmptyHeader, EmptyText } from "./Table.styles";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { StyledEmpty } from "../TableV2/Table.styles";
import { useVirtual } from "react-virtual";
import { ListSkeleton } from "../Skeleton";
import Empty from "./Empty";
import { SortOrder, SorterResult } from "../Table/TableProps";

interface ITableProps {
    selectedRowId?: number | null;
    alternate?: boolean;
    alternateHover?: boolean;
    className?: string;
    items?: any[];
    scroll?: any;
    columnsData: any[];
    sortable?: boolean;
    rowClick?: (props: any) => any;
    dataFetchFunction?: (options: { pageIndex?: number; pageSize?: number }) => any;
    loading?: boolean;
    height?: string;
}

type RenderFunction<T, U = T> = (props: { row: { original: U } }) => any;

export type Column<T> = {
    key?: string | undefined;
    title?: string;
    dataIndex?: string;
    sorter?: (a: any, b: any) => number;
    sortOrder?: (sortedInfo: SorterResult<T>, key: string | number) => SortOrder;
    ellipsis?: boolean;
    width?: number;
    render?: RenderFunction<T>;
};

function VirtualisedTable({
    columnsData,
    sortable = false,
    rowClick,
    dataFetchFunction,
    items,
    height,
    loading = false,
}: ITableProps) {
    useEffect(() => {
        if (!dataFetchFunction) {
            setData({ rows: items || [] });
        }
    }, [items]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [data, setData] = React.useState(() => {
        if (items) return { rows: items };
        else {
            return dataFetchFunction && dataFetchFunction({});
        }
    });
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const columns: any[] = [];
    const columnHelper = createColumnHelper();
    columnsData.map((item) => {
        columns.push(
            columnHelper.accessor(item.key, {
                cell: item.render ? item.render : (info) => info.getValue(),
                header: item.title ?? item.dataIndex,
                size: item.width,
            }),
        );
    });

    const table = useReactTable({
        data: data?.rows,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
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

    if (!loading && (!columns.length || !data?.rows?.length)) {
        return (
            <StyledEmpty>
                <Empty />
                <EmptyHeader> We could not find it! </EmptyHeader>
                <EmptyText> We are sorry, but your search did not have any result </EmptyText>
            </StyledEmpty>
        );
    } else {
        return (
            <StyledTable height={height}>
                <TableWrapper ref={tableContainerRef} className="container">
                    <table>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="table-cell"
                                            style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                        >
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
                                                                <div
                                                                    style={{ display: "flex", flexDirection: "column" }}
                                                                >
                                                                    <TriangleUpIcon color="#1890ff" />
                                                                    <TriangleDownIcon />
                                                                </div>
                                                            ),
                                                            desc: (
                                                                <div
                                                                    style={{ display: "flex", flexDirection: "column" }}
                                                                >
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
                        {!loading && (
                            <tbody>
                                {paddingTop > 0 && (
                                    <tr>
                                        <td style={{ height: `${paddingTop}px` }} />
                                    </tr>
                                )}
                                {virtualRows.map((virtualRow) => {
                                    const row = rows[virtualRow.index];
                                    return (
                                        <tr key={row.id} onClick={() => (rowClick ? rowClick(row) : "")}>
                                            {row.getVisibleCells().map((cell) => {
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className="virtual-table-cell"
                                                        style={{
                                                            width:
                                                                cell.column.getSize() !== 150
                                                                    ? cell.column.getSize()
                                                                    : undefined,
                                                        }}
                                                    >
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
                        )}
                    </table>
                    {loading && <ListSkeleton />}
                </TableWrapper>
            </StyledTable>
        );
    }
}

export default VirtualisedTable;
