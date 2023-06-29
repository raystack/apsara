import { useCallback, useState } from "react";

export const INITIAL_QUERY = { key: "", operator: "", value: "" };

export const useTableColumn = () => {
  const [columns, setColumns] = useState<string[]>([]);

  const addFilterColumn = useCallback(
    (column: string) => {
      const uniqeColumns = new Set([...columns, column]);
      setColumns(Array.from(uniqeColumns));
    },
    [columns]
  );
  const removeFilterColumn = useCallback(
    (column: string) => {
      const data = [...columns];
      const index = data.indexOf(column);
      if (index > -1) {
        data.splice(index, 1);
      }
      setColumns(data);
    },
    [columns]
  );

  const resetColumns = useCallback(() => setColumns([]), []);
  return {
    filteredColumns: columns,
    addFilterColumn,
    removeFilterColumn,
    resetColumns,
  };
};
