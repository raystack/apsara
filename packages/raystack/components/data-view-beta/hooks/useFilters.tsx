import {
  FilterOperatorTypes,
  FilterType,
  filterOperators
} from '~/types/filters';
import { DataViewField } from '../data-view.types';
import { getDataType } from '../utils/filter-operations';
import { useDataView } from './useDataView';

export function useFilters<TData>() {
  const { updateTableQuery } = useDataView<TData>();

  function onAddFilter(field: DataViewField<TData>) {
    const options = field.filterOptions || [];
    const filterType = field.filterType || FilterType.string;
    const dataType = getDataType({ filterType, dataType: field.dataType });
    const defaultFilter = filterOperators[filterType][0];
    const defaultValue =
      field.defaultFilterValue ??
      (filterType === FilterType.date
        ? new Date()
        : filterType === FilterType.select
          ? options[0]?.value
          : '');

    updateTableQuery(query => {
      return {
        ...query,
        filters: [
          ...(query.filters || []),
          {
            _dataType: dataType,
            _type: filterType,
            name: field.accessorKey,
            value: defaultValue,
            operator: defaultFilter.value
          }
        ]
      };
    });
  }

  function handleRemoveFilter(fieldAccessor: string) {
    updateTableQuery(query => {
      return {
        ...query,
        filters: query.filters?.filter(filter => filter.name !== fieldAccessor)
      };
    });
  }

  function handleFilterValueChange(fieldAccessor: string, value: any) {
    updateTableQuery(query => {
      return {
        ...query,
        filters: query.filters?.map(filter => {
          if (filter.name === fieldAccessor) {
            return { ...filter, value };
          }
          return filter;
        })
      };
    });
  }

  function handleFilterOperationChange(
    fieldAccessor: string,
    operator: FilterOperatorTypes
  ) {
    updateTableQuery(query => {
      return {
        ...query,
        filters: query.filters?.map(filter => {
          if (filter.name === fieldAccessor) {
            return { ...filter, operator };
          }
          return filter;
        })
      };
    });
  }

  return {
    onAddFilter,
    handleRemoveFilter,
    handleFilterValueChange,
    handleFilterOperationChange
  };
}
