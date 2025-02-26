import { FilterChip } from "../../filter-chip";
import { ColumnData, DataTableColumnDef } from "../data-table.types";
import { IconButton } from "../../icon-button";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";
import { Flex } from "../../flex";
import { filterOperationsMap } from "~/v1/types/filters";
import { Column } from "@tanstack/table-core";

interface AddFilterProps<TData, TValue> {
  columnList: Column<TData, unknown>[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (column: Column<TData, TValue>) => void;
}

function AddFilter<TData, TValue>({
  columnList = [],
  appliedFiltersSet,
  onAddFilter,
}: AddFilterProps<TData, TValue>) {
  const availableFilters = columnList?.filter(
    (col) => !appliedFiltersSet.has(col.id)
  );

  return availableFilters.length > 0 ? (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        {appliedFiltersSet.size > 0 ? (
          <IconButton size={4}>
            <FilterIcon />
          </IconButton>
        ) : (
          <Button variant={"text"} size={"small"} leadingIcon={<FilterIcon />}>
            Filter
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {availableFilters?.map((column) => {
          const columnDef = column.columnDef as DataTableColumnDef<
            TData,
            TValue
          >;
          const id = columnDef.accessorKey || column.id;
          return (
            <DropdownMenu.Item
              key={id}
              onSelect={() => onAddFilter(column as Column<TData, TValue>)}
            >
              {columnDef.header || id}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  ) : null;
}

export function Filters<TData, TValue>() {
  const { table, updateTableState, tableState } = useDataTable();
  const columns = table?.getAllColumns();

  function onAddFilter(column: Column<TData, TValue>) {
    const columnDef = column.columnDef as DataTableColumnDef<TData, TValue>;
    const id = columnDef.accessorKey || column.id;
    const defaultFilter = filterOperationsMap[columnDef.columnType][0];
    updateTableState((state) => {
      return {
        ...state,
        filters: [
          ...(state.filters || []),
          // TODO: Add default filter value in column definition
          {
            name: id,
            value: "",
            operator: defaultFilter.value,
          },
        ],
      };
    });
  }

  function handleRemoveFilter(columnId: string) {
    updateTableState((state) => {
      return {
        ...state,
        filters: state.filters?.filter((filter) => filter.name !== columnId),
      };
    });
  }

  const columnList = columns?.filter(
    (column) => column.columnDef.enableColumnFilter
  );

  const appliedFiltersSet = new Set(
    tableState?.filters?.map((filter) => filter.name)
  );

  const appliedFilters =
    tableState?.filters?.map((filter) => {
      const columnDef = columns?.find((col) => {
        const columnDef = col.columnDef as DataTableColumnDef<TData, TValue>;
        const id = columnDef.accessorKey || col.id;
        return id === filter.name;
      })?.columnDef as DataTableColumnDef<TData, TValue>;
      return {
        columnType: columnDef.columnType || "text",
        label: columnDef.header as string,
        ...filter,
      };
    }) || [];

  return (
    <Flex gap={3}>
      <Flex gap={3}>
        {appliedFilters.map((filter) => (
          <FilterChip
            key={filter.name}
            label={filter.label}
            onRemove={() => handleRemoveFilter(filter.name)}
            columnType={filter.columnType}
          />
        ))}
      </Flex>
      <AddFilter
        columnList={columnList}
        appliedFiltersSet={appliedFiltersSet}
        onAddFilter={onAddFilter}
      />
    </Flex>
  );
}
