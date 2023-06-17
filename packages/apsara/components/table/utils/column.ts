import type { Column, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { RaypointColumnDef, RaypointFilterOption } from "../Table.types";

export const getColumnId = <TData extends Record<string, any> = {}>(
  columnDef: RaypointColumnDef<TData>
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header;

export const getAllLeafColumnDefs = <TData extends Record<string, any> = {}>(
  columns: RaypointColumnDef<TData>[]
) => {
  const allLeafColumnDefs: RaypointColumnDef<TData>[] = [];
  const getLeafColumns = (cols: RaypointColumnDef<TData>[]) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns);
      } else {
        allLeafColumnDefs.push(col);
      }
    });
  };
  getLeafColumns(columns);
  return allLeafColumnDefs;
};

export const getDefaultColumnFilterFn = <
  TData extends Record<string, any> = {}
>(
  columnDef: RaypointColumnDef<TData> | undefined
): RaypointFilterOption => {
  if (columnDef?.filterVariant === "multi-select") return "arrIncludesSome";
  if (columnDef?.filterVariant === "range") return "betweenInclusive";
  if (
    columnDef?.filterVariant === "select" ||
    columnDef?.filterVariant === "checkbox"
  )
    return "equals";
  return "fuzzy";
};

export const getAllColumnsData = (table: Table<any>) => {
  const headers = table.getHeaderGroups()[0].headers;
  return headers
    .filter((header) => {
      const headerColumnMeta = header.column.columnDef.meta as any;
      return headerColumnMeta?.headerFilter !== false;
    })
    .map((header) => ({
      name: flexRender(header.column.columnDef.header, header.getContext()),
      key: header.id,
      value: header.id,
    }));
};

export const getColumnName = (column: Column<any, unknown> | undefined) =>
  typeof column?.columnDef?.header === "string"
    ? column?.columnDef?.header
    : // @ts-ignore
      column.columnDef?.header();
