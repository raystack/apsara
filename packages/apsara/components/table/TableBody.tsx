import type { Row } from "@tanstack/react-table";
import { defaultColumnSizing, flexRender } from "@tanstack/react-table";
import type { ReactElement, ReactNode } from "react";
import { styled } from "../../stitches.config";
import { useTable } from "./hooks/useTable";

interface TableBodyProps<T> {
  children?: ReactNode;
  rows: Row<T>[];
}

interface TableBodyType {
  <T>(props: TableBodyProps<T>): ReactElement;
}

export const TableBody: TableBodyType = ({ children, rows }) => {
  const { multiRowSelectionEnabled } = useTable();
  return (
    <StyledTableBody>
      {rows.map((row, index) => {
        return (
          <TableRow
            key={`${row.id}_${index}`}
            onClick={() => row.toggleSelected()}
            aria-selected={row.getIsSelected()}
          >
            {row.getVisibleCells().map((cell) => {
              const size = cell.column.getSize();
              const width =
                size !== defaultColumnSizing.size ? size : undefined;
              const widthStyle = width ? { width: `${width}px` } : { flex: 1 };
              return (
                <Td
                  key={cell.id}
                  css={
                    multiRowSelectionEnabled
                      ? { ...widthStyle, "&:first-child": fistChildStyle }
                      : widthStyle
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </TableRow>
        );
      })}
    </StyledTableBody>
  );
};

export const StyledTableBody = styled("tbody", {
  overflow: "scroll",
});

const TableRow = styled("tr", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  borderBottom: "1px solid $borderBase",
  py: "$2",
  "&:hover": {
    backgroundColor: "$borderBaseHover",
  },
  a: {
    textDecoration: "none",
  },
});

const Td = styled("td", {
  display: "inline-flex",
  alignItems: "center",
  color: "$fgBase",
});

const fistChildStyle = {
  minWidth: 48,
  flex: 0,
  display: "flex",
};
