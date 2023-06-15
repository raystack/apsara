import type { HeaderGroup } from "@tanstack/react-table";
import type { ReactElement, ReactNode } from "react";
import React from "react";
import { styled } from "~/stitches.config";
import { useTable } from "../hooks/useTable";
import TableHeaderRow from "./TableHeaderRow";

interface TableHeaderProps<T> {
    children?: ReactNode;
    headerGroups: HeaderGroup<T>[];
}

interface TableHeaderType {
    <T>(props: TableHeaderProps<T>): ReactElement;
}

export const TableHeader: TableHeaderType = () => {
    const { table } = useTable();
    const { getHeaderGroups } = table;

    return (
        <StyledTableHeader>
            {getHeaderGroups().map((headerGroup) => (
                <TableHeaderRow key={headerGroup.id} headerGroup={headerGroup} />
            ))}
        </StyledTableHeader>
    );
};

const StyledTableHeader = styled("thead", {
    backgroundColor: "$bgBase",
    tr: {
        backgroundColor: "$bgBase",
    },

    input: {
        "&::before": {
            top: "1px",
            borderWidth: "0 2.5px 0px 0",
            borderRadius: 0,
            transform: "rotate(90deg)",
        },
    },
});
