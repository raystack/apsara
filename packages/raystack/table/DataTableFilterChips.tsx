import { PlusIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { ColumnMeta, FilterFn } from "@tanstack/react-table";
import { Flex } from "~/flex";
import { DataTableFilterOptions } from "./DataTableFilterOptions";
import { FilterChip } from "~/v1/components/filter-chip";
import { useTable } from "./hooks/useTable";
import { ApsaraColumnDef } from "./datatables.types";
import styles from "./datatable.module.css";

interface FilterColumnMeta extends ColumnMeta<unknown, any> {
  data?: { label?: string; value: string }[];
}

type DataTableFilterChipsProps = ComponentProps<typeof Flex>;

export function DataTableFilterChips(props: DataTableFilterChipsProps) {
  const { filteredColumns, table, updateColumnCustomFilter } = useTable();
  const tableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" &&
        column.getCanHide() &&
        column.getCanFilter()
    );

  if (!filteredColumns.length) return null;

  return (
    <Flex gap="small" align="center" className={styles.chipWrapper} {...props}>
      {filteredColumns.map((filter, index) => {
        const filteredColumn = table.getColumn(filter)!;
        const columnDef = filteredColumn.columnDef as ApsaraColumnDef<unknown>;
        const columnHeader = columnDef.header;
        const columnName = typeof columnHeader === "string" ? columnHeader : filter;
        const options = ((columnDef.meta as FilterColumnMeta)?.data || []).map(opt => ({
          label: opt.label || opt.value,
          value: opt.value
        }));

        return (
          <FilterChip
            key={index}
            label={columnName}
            columnType={columnDef.filterVariant}
            options={options}
            onValueChange={(value) => {
              filteredColumn.setFilterValue(value);
            }}
            onOperationChange={(operation) => {
              // Find the corresponding operation function from your filterFns
              const operationFn = columnDef.filterFn;
              if (typeof operationFn === 'function') {
                updateColumnCustomFilter(filter, operationFn as FilterFn<any>);
              }
            }}
            onRemove={() => {
              filteredColumn.setFilterValue(undefined);
              const index = filteredColumns.indexOf(filter);
              if (index > -1) {
                filteredColumns.splice(index, 1);
              }
            }}
          />
        );
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
