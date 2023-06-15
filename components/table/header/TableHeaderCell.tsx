import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import type { Header } from "@tanstack/react-table";
import { defaultColumnSizing, flexRender } from "@tanstack/react-table";
import React from "react";
import { Text } from "~/components/text";
import { styled } from "~/stitches.config";
import { useTable } from "../hooks/useTable";

type Props = {
    header: Header<any, unknown>;
};
export default function TableHeaderCell({ header }: Props) {
    const { multiRowSelectionEnabled } = useTable();
    const size = header.column.getSize();
    const width = size !== defaultColumnSizing.size ? size : undefined;
    const widthStyle = width ? { width: `${width}px` } : { flex: 1 };
    return (
        <Th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            css={multiRowSelectionEnabled ? { ...widthStyle, "&:first-child": fistChildStyle } : widthStyle}
        >
            <Text css={{ display: "flex" }}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {{
                    asc: <ArrowUpIcon />,
                    desc: <ArrowDownIcon />,
                }[header.column.getIsSorted() as string] ?? null}
            </Text>
        </Th>
    );
}

const Th = styled("th", {
    height: 40,
    display: "inline-flex",
    alignItems: "center",
    minWidth: "min-content",
    padding: 0,
    letterSpacing: ".8px",
    color: "$fgBase",
});

const fistChildStyle = {
    minWidth: 48,
    flex: 0,
    "&:hover": {
        backgroundColor: "transparent",
    },
};
