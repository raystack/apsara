import React from "react";
import { TableProps } from "antd";
import { StyledTable, StyledEmpty, EmptyHeader, EmptyText } from "./Table.styles";

const EmptyComponent = () => {
    return (
        <StyledEmpty description={false}>
            <EmptyHeader> We could not find it! </EmptyHeader>
            <EmptyText> We are sorry, but your search did not have any result </EmptyText>
        </StyledEmpty>
    );
};

interface ITableProps extends TableProps<any> {
    items: Record<string, unknown>[];
    selectedRowId?: number | null;
    onRowClick?: (event: any, rowIndexData: any) => void;
    alternate?: boolean;
    alternateHover?: boolean;
    className?: string;
}

function Table({
    items,
    rowKey = "id",
    className = "",
    selectedRowId = null,
    onRowClick = () => null,
    alternate,
    alternateHover,
    ...props
}: ITableProps) {
    return (
        <StyledTable
            dataSource={items}
            rowKey={rowKey}
            pagination={false}
            showSorterTooltip={false}
            className={`${alternate && "alternate"} ${alternateHover && "alternate-hover"} ${className}`}
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
