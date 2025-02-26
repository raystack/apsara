import clsx from "clsx";
import { Flex } from "../../flex";
import styles from "../data-table.module.css";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DisplaySettings } from "./display-settings";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";
import { FilterChip } from "../../filter-chip";
import { ColumnData, DataTableColumnDef } from "../data-table.types";
import { IconButton } from "../../icon-button";

interface AddFilterProps {
  columnList: ColumnData[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (columnId: string) => void;
}

function AddFilter({
  columnList = [],
  appliedFiltersSet,
  onAddFilter,
}: AddFilterProps) {
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
        {availableFilters?.map((column) => (
          <DropdownMenu.Item
            key={column.id}
            onSelect={() => onAddFilter(column.id)}
          >
            {column.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  ) : null;
}

function Filters<TData, TValue>() {
  const { table, updateTableState, tableState } = useDataTable();
  const columns = table?.getAllColumns();

  function onAddFilter(columnId: string) {
    updateTableState((state) => {
      return {
        ...state,
        filters: [
          ...(state.filters || []),
          { name: columnId, value: "", operator: "contains" },
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

  const columnList = columns?.map((column) => {
    const id = column.id;
    return {
      label: (column.columnDef.header as string) || id,
      id: id,
    };
  });

  const appliedFiltersSet = new Set(
    tableState?.filters?.map((filter) => filter.name)
  );

  const appliedFilters =
    tableState?.filters?.map((filter) => {
      const column = columns?.find((col) => col.id === filter.name);
      const columnDef = column?.columnDef as DataTableColumnDef<TData, TValue>;
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

export function Toolbar<TData, TValue>({ className }: { className?: string }) {
  return (
    <Flex
      className={clsx(styles["toolbar"], className)}
      justify={"between"}
      align={"center"}
    >
      <Filters<TData, TValue> />
      <DisplaySettings />
    </Flex>
  );
}
