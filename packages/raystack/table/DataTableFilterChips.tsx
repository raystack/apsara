import { PlusIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { Flex } from "~/flex";
import { DataTableFilterOptions } from "./DataTableFilterOptions";
import { FilteredChip } from "./FilteredChip";
import styles from "./datatable.module.css";
import { useTable } from "./hooks/useTable";

type DataTableFilterChipsProps = ComponentProps<typeof Flex>;
export function DataTableFilterChips(props: DataTableFilterChipsProps) {
  const { filteredColumns, table } = useTable();
  const tableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  if (!filteredColumns.length) return null;

  return (
    <Flex gap="small" align="center" className={styles.chipWrapper} {...props}>
      {filteredColumns.map((filter, index) => {
        const filteredColumn = table.getColumn(filter)!;
        return <FilteredChip key={index} column={filteredColumn} />;
      })}

      {filteredColumns.length < tableColumns.length && (
        <DataTableFilterOptions
          variant="ghost"
          style={{ border: "none", background: "none" }}
        >
          <PlusIcon width={16} height={16} />
        </DataTableFilterOptions>
      )}
    </Flex>
  );
}
