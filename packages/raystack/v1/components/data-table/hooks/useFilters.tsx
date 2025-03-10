import { useDataTable } from "./useDataTable";
import {
  FilterOperatorTypes,
  FilterType,
  filterOperators,
} from "~/v1/types/filters";
import { DataTableColumn } from "../data-table.types";

export function useFilters<TData, TValue>() {
  const { updateTableQuery } = useDataTable();

  function onAddFilter(column: DataTableColumn<TData, TValue>) {
    const columnDef = column.columnDef;
    const id = columnDef.accessorKey || column.id;
    const options = columnDef.filterOptions || [];
    const filterType = columnDef.filterType || FilterType.text;
    const defaultFilter = filterOperators[filterType][0];
    const defaultValue =
      filterType === FilterType.date
        ? new Date()
        : filterType === FilterType.select
        ? options[0].value
        : "";

    updateTableQuery((query) => {
      return {
        ...query,
        filters: [
          ...(query.filters || []),
          // TODO: Add default filter value in column definition
          {
            _type: filterType,
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

  function handleFilterOperationChange(
    columnId: string,
    operator: FilterOperatorTypes
  ) {
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

  return {
    onAddFilter,
    handleRemoveFilter,
    handleFilterValueChange,
    handleFilterOperationChange,
  };
}
