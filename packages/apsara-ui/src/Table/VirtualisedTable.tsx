import React, { useState, useEffect, useRef, useCallback } from "react";
import ResizeObserver from "rc-resize-observer";
import { TableProps } from "antd/lib/table";
import InfiniteLoader from "react-window-infinite-loader";
import clsx from "clsx";
import Table from "./Table";
import { StyledGrid } from "./Table.styles";
import useWindowDimensions from "../hooks/useWindowDimensions";

const DEFAULT_HEIGHT = 700;

const Cell = ({
    columnData,
    rowData,
    onRowClick,
    totalColumns,
    columnIndex,
    rowIndex,
    selectedRowId,
    style,
    onRowMouseEnter,
    onRowMouseLeave,
}: any) => {
    const className = clsx("virtual-table-cell", `virtual-table-row-${rowIndex}`, {
        "virtual-table-cell-last": columnIndex === totalColumns - 1,
        "virtual-table-even": rowIndex % 2 === 0,
        "virtual-table-odd": rowIndex % 2 !== 0,
        "virtual-table-first-child": columnIndex === 0,
        "virtual-table-last-child": columnIndex === totalColumns - 1,
        highlightRow: rowData?.id === selectedRowId,
    });

    return (
        <div
            role="presentation"
            className={className}
            style={style}
            onClick={(event) => onRowClick(event, rowData)}
            onMouseEnter={() => onRowMouseEnter(rowIndex)}
            onMouseLeave={() => onRowMouseLeave(rowIndex)}
        >
            {columnData?.render
                ? columnData.render(rowData[columnData.dataIndex], rowData)
                : rowData[columnData.dataIndex]}
        </div>
    );
};

export interface IVirtualTable extends TableProps<any> {
    columns: any[];
    items: any[];
    selectedRowId?: number | null;
    scroll?: any;
    margin?: {
        top?: number;
        bottom?: number;
    };
    loadMore?: () => Promise<void> | null;
    onRowClick?: (event: any, rowIndexData: any) => void;
    calculateRowHeight?: any;
    calculateColumnWidth?: any;
    alternate?: boolean;
    alternateHover?: boolean;
    className?: string;
}
const VirtualTableComponent = ({
    columns = [],
    scroll,
    selectedRowId = null,
    onRowClick = () => null,
    loadMore = () => null,
    margin = { top: 0, bottom: 0 },
    calculateRowHeight,
    calculateColumnWidth,
    className = "",
    alternate,
    alternateHover,
    ...props
}: IVirtualTable) => {
    const [tableWidth, setTableWidth] = useState(0);
    const [lastIndex, setLastIndex] = useState(0);
    const widthColumnCount = columns.filter(({ width }) => !width).length;
    const totalColumnDefinedWidth = columns.reduce((acc, { width = 0 }) => acc + width, 0);
    const mergedColumns = columns.map((column) => {
        if (column.width) {
            return column;
        }
        const remaningWidth = tableWidth > widthColumnCount ? tableWidth - totalColumnDefinedWidth : tableWidth;
        return { ...column, width: Math.floor(remaningWidth / widthColumnCount) };
    });
    const gridRef = useRef<any>();
    const [connectObject] = useState<any>(() => {
        const obj = {};
        Object.defineProperty(obj, "scrollLeft", {
            get: () => null,
            set: (scrollLeft: number) => {
                if (gridRef.current) {
                    gridRef.current.scrollTo({ scrollLeft });
                }
            },
        });
        Object.defineProperty(obj, "ownerDocument", {
            get: () => document.body.ownerDocument,
        });

        return obj;
    });

    const resetVirtualGrid = () => {
        gridRef.current &&
            gridRef.current.resetAfterIndices({
                columnIndex: 0,
                shouldForceUpdate: true,
            });
    };

    useEffect(() => resetVirtualGrid, []);
    useEffect(() => resetVirtualGrid, [tableWidth]);

    const onRowMouseEnter = useCallback((index) => {
        const cells = Array.from(document.getElementsByClassName(`virtual-table-row-${index}`));
        cells.forEach((cell) => {
            cell.classList.add("virtual-table-row-hover");
        });
    }, []);

    const onRowMouseLeave = useCallback((index) => {
        const cells = Array.from(document.getElementsByClassName(`virtual-table-row-${index}`));
        cells.forEach((cell) => {
            cell.classList.remove("virtual-table-row-hover");
        });
    }, []);

    const RenderVirtualList = (rawData: readonly Record<string, unknown>[], { scrollbarSize, ref, onScroll }: any) => {
        // eslint-disable-next-line no-param-reassign
        ref.current = connectObject;
        const rowCount = rawData.length;
        const isItemLoaded = (index: number) => index < lastIndex;

        async function loadMoreItems(_: number, stopIndex: number) {
            if (stopIndex === rowCount - 1) {
                await loadMore();
            }
            setLastIndex(stopIndex);
        }

        const { height } = useWindowDimensions();

        return (
            <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={rowCount} loadMoreItems={loadMoreItems}>
                {({ onItemsRendered }) => (
                    <StyledGrid
                        onItemsRendered={({
                            visibleRowStartIndex,
                            visibleRowStopIndex,
                            overscanRowStartIndex,
                            overscanRowStopIndex,
                        }) =>
                            onItemsRendered({
                                visibleStartIndex: visibleRowStartIndex,
                                visibleStopIndex: visibleRowStopIndex,
                                overscanStartIndex: overscanRowStartIndex,
                                overscanStopIndex: overscanRowStopIndex,
                            })
                        }
                        ref={gridRef}
                        columnCount={mergedColumns.length}
                        columnWidth={(index) => {
                            const { width } = mergedColumns[index];
                            const columnWidthValue =
                                index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width;

                            if (calculateColumnWidth) {
                                return calculateColumnWidth(index, columnWidthValue);
                            }
                            return columnWidthValue;
                        }}
                        height={height - (margin?.top || 0) - (margin?.bottom || 0)}
                        rowCount={rowCount}
                        rowHeight={(index) => {
                            const defaultRowHeight = 54;
                            if (calculateRowHeight) {
                                return calculateRowHeight(index, defaultRowHeight);
                            }
                            return defaultRowHeight;
                        }}
                        width={tableWidth}
                        onScroll={({ scrollLeft }) => {
                            onScroll({
                                scrollLeft,
                            });
                        }}
                    >
                        {({ columnIndex, rowIndex, style }) => {
                            const columnIndexData = mergedColumns[columnIndex];
                            const rowIndexData = rawData[rowIndex];
                            return (
                                <Cell
                                    columnData={columnIndexData}
                                    rowData={rowIndexData}
                                    style={style}
                                    totalColumns={mergedColumns.length}
                                    columnIndex={columnIndex}
                                    rowIndex={rowIndex}
                                    selectedRowId={selectedRowId}
                                    onRowClick={onRowClick}
                                    onRowMouseEnter={onRowMouseEnter}
                                    onRowMouseLeave={onRowMouseLeave}
                                />
                            );
                        }}
                    </StyledGrid>
                )}
            </InfiniteLoader>
        );
    };
    return (
        <ResizeObserver
            onResize={({ width }) => {
                setTableWidth(width);
            }}
        >
            <Table
                {...props}
                className={className}
                alternate={alternate}
                alternateHover={alternateHover}
                scroll={scroll}
                selectedRowId={selectedRowId}
                columns={mergedColumns}
                onRowClick={onRowClick}
                pagination={false}
                components={{
                    body: RenderVirtualList,
                }}
            />
        </ResizeObserver>
    );
};

function VirtualTable({ items = [], columns = [], ...props }: IVirtualTable) {
    return (
        <VirtualTableComponent columns={columns} items={items} scroll={{ y: DEFAULT_HEIGHT, x: "100vw" }} {...props} />
    );
}

export default VirtualTable;
