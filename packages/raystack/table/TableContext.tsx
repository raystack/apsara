import type { OnChangeFn, Table, TableState } from "@tanstack/react-table";
import { createContext } from "react";

export type onTableChangeEvent = (params: TableState & TableFormType) => void;

export type TableFormType = {
  /**
   * @example {type: "LONG", origin: "system"}
   */
  predicates: Record<string, string>;
};

type TableContextType = {
  table: Table<any>;
  filteredColumns: string[];
  addFilterColumn: (column: string) => void;
  removeFilterColumn: (column: string) => void;
  onChange: () => void;
  resetColumns: () => void;
  globalFilter: string;
  onGlobalFilterChange: OnChangeFn<any>;
  // state: TableState;
  // setState: Dispatch<(prevState: TableState) => TableState>;
  // filterQuery: (typeof INITIAL_QUERY)[];
  // setFilterQuery: Dispatch<React.SetStateAction<(typeof INITIAL_QUERY)[]>>;
  // clearFilters: () => void;
  // getSelectedRow: () => any | null;
  // getSelectedRows: () => any[];
  // clearSelection: () => void;
  // containerRef: RefObject<HTMLDivElement>;
  // multiRowSelectionEnabled?: boolean;
  // tableColumnsOrdered: Array<ColumnDef<any> & { hidden?: true }>;
  // setTableColumnsOrdered: React.Dispatch<React.SetStateAction<any[]>>;
};

export const TableContext = createContext<TableContextType | null>(null);
