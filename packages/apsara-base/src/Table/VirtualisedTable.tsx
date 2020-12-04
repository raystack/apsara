import React, { useState, useEffect, useRef } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { TableProps } from "antd/lib/table";

import Table from "./Table";

const DEFAULT_HEIGHT = 700;

interface IVirtualTable extends TableProps<any> {
    columns: any[];
    items: any[];
    selectedRowId?: number | null;
    scroll?: any;
    onRowClick?: (event: any, rowIndexData: any) => null;
}
const VirtualTableComponent = ({
    columns = [],
    scroll,
    selectedRowId = null,
    onRowClick = () => null,
    ...props
}: IVirtualTable) => {
    const [tableWidth, setTableWidth] = useState(0);

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

    const renderVirtualList = (rawData: Record<string, unknown>[], { scrollbarSize, ref, onScroll }: any) => {
        // eslint-disable-next-line no-param-reassign
        ref.current = connectObject;
        return (
            <Grid
                ref={gridRef}
                className="virtual-grid"
                columnCount={mergedColumns.length}
                columnWidth={(index) => {
                    const { width } = mergedColumns[index];
                    return index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width;
                }}
                height={scroll.y}
                rowCount={rawData.length}
                rowHeight={() => 54}
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
                        <div
                            role="presentation"
                            className={`virtual-table-cell ${
                                columnIndex === mergedColumns.length - 1 ? "virtual-table-cell-last" : ""
                            } ${rowIndex % 2 === 0 ? "virtual-table-even" : "virtual-table-odd"} ${
                                columnIndex === 0 ? "virtual-table-first-child" : ""
                            } 
              ${columnIndex === mergedColumns.length - 1 ? "virtual-table-last-child" : ""} 
              ${rowIndexData?.id === selectedRowId ? "highlightRow" : ""}`}
                            style={style}
                            onClick={(event) => onRowClick(event, rowIndexData)}
                        >
                            {columnIndexData?.render
                                ? columnIndexData.render(rowIndexData[columnIndexData.dataIndex], rowIndexData)
                                : rowIndexData[columnIndexData.dataIndex]}
                        </div>
                    );
                }}
            </Grid>
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
                scroll={scroll}
                selectedRowId={selectedRowId}
                columns={mergedColumns}
                onRowClick={onRowClick}
                pagination={false}
                components={{
                    body: renderVirtualList,
                }}
            />
        </ResizeObserver>
    );
};

const VirtualTable = ({ items = [], columns = [], ...props }: IVirtualTable) => {
    return (
        <VirtualTableComponent columns={columns} items={items} scroll={{ y: DEFAULT_HEIGHT, x: "100vw" }} {...props} />
    );
};

export default VirtualTable;
