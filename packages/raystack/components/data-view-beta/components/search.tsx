'use client';

import { ChangeEvent, type ComponentProps } from 'react';
import { Search } from '../../search';
import { useDataView } from '../hooks/useDataView';

export interface DataViewSearchProps extends ComponentProps<typeof Search> {
  /**
   * Automatically disable search in zero state (when no data and no filters/search applied).
   * @defaultValue true
   */
  autoDisableInZeroState?: boolean;
}

export function DataViewSearch({
  autoDisableInZeroState = true,
  disabled,
  ...props
}: DataViewSearchProps) {
  const {
    updateTableQuery,
    tableQuery,
    shouldShowFilters = false
  } = useDataView();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTableQuery(query => {
      return {
        ...query,
        search: value
      };
    });
  };

  const handleClear = () => {
    updateTableQuery(query => {
      return {
        ...query,
        search: ''
      };
    });
  };

  // Auto-disable in zero state if enabled, but allow manual override
  // Once search is applied, keep it enabled (even if shouldShowFilters is false)
  const hasSearch = Boolean(
    tableQuery?.search && tableQuery.search.trim() !== ''
  );
  const isDisabled =
    disabled ?? (autoDisableInZeroState && !shouldShowFilters && !hasSearch);

  return (
    <Search
      {...props}
      onChange={handleSearch}
      value={tableQuery?.search ?? ''}
      onClear={handleClear}
      disabled={isDisabled}
    />
  );
}

DataViewSearch.displayName = 'DataView.Search';
