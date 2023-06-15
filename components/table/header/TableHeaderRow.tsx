import type { HeaderGroup } from "@tanstack/react-table";
import React from "react";
import { styled } from "~/stitches.config";
import TableHeaderCell from "./TableHeaderCell";

type Props = {
    headerGroup: HeaderGroup<any>;
};
export default function TableHeaderRow({ headerGroup }: Props) {
    return (
        <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id} header={header} />
            ))}
        </TableRow>
    );
}

const TableRow = styled("tr", {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "2rem",
    cursor: "pointer",
    "&:hover": {
        backgroundColor: "$bgBase",
    },
    a: {
        textDecoration: "none",
    },
});
