import { FilterChip } from "../../filter-chip";
import { DataTableColumn } from "../data-table.types";
import { IconButton } from "../../icon-button";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";
import { Flex } from "../../flex";
import {
  filterOperationsMap,
  FilterType,
  FilterTypes,
} from "~/v1/types/filters";
import dayjs from "dayjs";
import { Day } from "react-day-picker";

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
  const { table, updateTableQuery, tableQuery } = useDataTable();
  const columns = table?.getAllColumns() as DataTableColumn<TData, TValue>[];

  function onAddFilter(column: DataTableColumn<TData, TValue>) {
    const columnDef = column.columnDef;
    const id = columnDef.accessorKey || column.id;
    const columnType = columnDef.columnType || "text";
    const defaultFilter = filterOperationsMap[columnType][0];
    const defaultValue = columnType === FilterType.datetime ? new Date() : "";
    updateTableQuery((query) => {
      return {
        ...query,
        filters: [
          ...(query.filters || []),
          // TODO: Add default filter value in column definition
          {
            _type: columnType,
            name: id,
            value: defaultValue,
            operator: defaultFilter.value,
          },
        ],
      };
    });
  }

  function handleRemoveFilter(columnId: string) {
    updateTableQuery((query) => {
      return {
        ...query,
        filters: query.filters?.filter((filter) => filter.name !== columnId),
      };
    });
  }

  function handleFilterValueChange(columnId: string, value: any) {
    updateTableQuery((query) => {
      return {
        ...query,
        filters: query.filters?.map((filter) => {
          if (filter.name === columnId) {
            return { ...filter, value };
          }
          return filter;
        }),
      };
    });
  }

  function handleFilterOperationChange(columnId: string, operator: string) {
    updateTableQuery((query) => {
      return {
        ...query,
        filters: query.filters?.map((filter) => {
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
