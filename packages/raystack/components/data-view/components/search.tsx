'use client';

import { ChangeEvent, type ComponentProps } from 'react';
import { Search } from '../../search';
import { useDataView } from '../hooks/useDataView';

export interface DataViewSearchProps extends ComponentProps<typeof Search> {
  /**
   * Automatically disable search in zero state (no data and no active filters).
   * @defaultValue true
   */
  autoDisableInZeroState?: boolean;
}

export function DataViewSearch({
  autoDisableInZeroState = true,
  disabled,
  ...props
}: DataViewSearchProps) {
  const { updateTableQuery, tableQuery, shouldShowFilters } = useDataView();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTableQuery(query => ({ ...query, search: value }));
  };

  const handleClear = () => {
    updateTableQuery(query => ({ ...query, search: '' }));
  };

  // Keep enabled once the user has typed, even if zero-state otherwise applies.
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
