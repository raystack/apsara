import React from "react";
import { Table as AntTable, Empty } from "antd";
import { TableProps } from "antd/lib/table";

const EmptyComponent = () => {
    return (
        <Empty description={false}>
            <p className="empty__header"> We could not find it! </p>
            <p className="empty__text"> We are sorry, but your search did not have any result </p>
        </Empty>
    );
};

import "./Table.style.less";

interface ITableProps extends TableProps<any> {
    items: Record<string, unknown>[];
    selectedRowId?: number | null;
    onRowClick?: (event: any, rowIndexData: any) => null;
    alternate?: boolean;
    alternateHover?: boolean;
}

function Table({
    items,
    rowKey = "id",
    selectedRowId = null,
    onRowClick = () => null,
    alternate,
    alternateHover,
    ...props
}: ITableProps) {
    return (
        <AntTable
            dataSource={items}
            rowKey={rowKey}
            pagination={false}
            showSorterTooltip={false}
            className={`skeleton-table ${alternate && "alternate"} ${alternateHover && "alternate-hover"}`}
            locale={{ emptyText: <EmptyComponent /> }}
            rowClassName={(record: any) => (selectedRowId === record.id ? "highlightRow" : "")}
            onRow={(record: any) => {
                return {
                    onClick: (event) => onRowClick(event, record),
                };
            }}
            {...props}
        />
    );
}

export default Table;
