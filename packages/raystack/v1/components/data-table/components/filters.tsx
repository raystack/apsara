import { FilterChip } from "../../filter-chip";
import { DataTableColumn } from "../data-table.types";
import { IconButton } from "../../icon-button";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";
import { Flex } from "../../flex";
import { filterOperationsMap } from "~/v1/types/filters";
import { Column } from "@tanstack/table-core";

interface AddFilterProps<TData, TValue> {
  columnList: DataTableColumn<TData, TValue>[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (column: DataTableColumn<TData, TValue>) => void;
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
          const columnDef = column.columnDef;
          const id = columnDef.accessorKey || column.id;
          return (
            <DropdownMenu.Item key={id} onSelect={() => onAddFilter(column)}>
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
  const columns = table?.getAllColumns() as DataTableColumn<TData, TValue>[];

  function onAddFilter(column: DataTableColumn<TData, TValue>) {
    const columnDef = column.columnDef;
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

  function handleFilterValueChange(columnId: string, value: any) {
    updateTableState((state) => {
      return {
        ...state,
        filters: state.filters?.map((filter) => {
          if (filter.name === columnId) {
            return { ...filter, value };
          }
          return filter;
        }),
      };
    });
  }

  function handleFilterOperationChange(columnId: string, operator: string) {
    updateTableState((state) => {
      return {
        ...state,
        filters: state.filters?.map((filter) => {
          if (filter.name === columnId) {
            return { ...filter, operator };
          }
          return filter;
        }),
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
        const columnDef = col.columnDef;
        const id = columnDef.accessorKey || col.id;
        return id === filter.name;
      })?.columnDef;
      return {
        columnType: columnDef?.columnType || "text",
        label: (columnDef?.header as string) || "",
        options: columnDef?.filterOptions || [],
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
            onValueChange={(value) =>
              handleFilterValueChange(filter.name, value)
            }
            onOperationChange={(operator) =>
              handleFilterOperationChange(filter.name, operator)
            }
            columnType={filter.columnType}
            options={filter.options}
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
