import type { ColumnDef, Table, TableState } from "@tanstack/react-table";
import type { Dispatch, RefObject } from "react";
import { createContext } from "react";
import type { INITIAL_QUERY } from "./hooks/useTableFilter";

export type onTableChangeEvent = (params: TableState & TableFormType) => void;

export type TableFormType = {
  /**
   * @example {type: "LONG", origin: "system"}
   */
  predicates: Record<string, string>;
};

type TableContextType = {
  table: Table<any>;
  state: TableState;
  setState: Dispatch<(prevState: TableState) => TableState>;
  filterQuery: (typeof INITIAL_QUERY)[];
  setFilterQuery: Dispatch<React.SetStateAction<(typeof INITIAL_QUERY)[]>>;
  onChange: () => void;
  clearFilters: () => void;
  getSelectedRow: () => any | null;
  getSelectedRows: () => any[];
  clearSelection: () => void;
  containerRef: RefObject<HTMLDivElement>;
  multiRowSelectionEnabled?: boolean;
  tableColumnsOrdered: Array<ColumnDef<any> & { hidden?: true }>;
  setTableColumnsOrdered: React.Dispatch<React.SetStateAction<any[]>>;
};

export const TableContext = createContext<TableContextType | null>(null);
