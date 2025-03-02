import { FilterChip } from "../../filter-chip";
import { DataTableColumn } from "../data-table.types";
import { IconButton } from "../../icon-button";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";
import { Flex } from "../../flex";
import { FilterOperatorTypes } from "~/v1/types/filters";
import { useFilters } from "../hooks/useFilters";

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
  const { table, tableQuery } = useDataTable();
  const columns = table?.getAllColumns() as DataTableColumn<TData, TValue>[];

  const {
    onAddFilter,
    handleRemoveFilter,
    handleFilterValueChange,
    handleFilterOperationChange,
  } = useFilters<TData, TValue>();

  const columnList = columns?.filter(
    (column) => column.columnDef.enableColumnFilter
  );

  const appliedFiltersSet = new Set(
    tableQuery?.filters?.map((filter) => filter.name)
  );

  const appliedFilters =
    tableQuery?.filters?.map((filter) => {
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
            value={filter.value}
            onRemove={() => handleRemoveFilter(filter.name)}
            onValueChange={(value) =>
              handleFilterValueChange(filter.name, value)
            }
            onOperationChange={(operator) =>
              handleFilterOperationChange(
                filter.name,
                operator as FilterOperatorTypes
              )
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
