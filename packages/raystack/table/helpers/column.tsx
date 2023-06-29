import type { Column } from "@tanstack/react-table";

export const getColumnName = (column: Column<any, unknown> | undefined) =>
  typeof column?.columnDef?.header === "string"
    ? column?.columnDef?.header
    : // @ts-ignore
      column.columnDef?.header();
