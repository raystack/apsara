'use client';

import { forwardRef } from 'react';
import { Search } from '../../search';
import { SearchProps } from '../../search/search';
import { useDataTable } from '../hooks/useDataTable';

export interface DataTableSearchProps extends SearchProps {
  /**
   * Automatically disable search in zero state (when no data and no filters/search applied).
   * @defaultValue true
   */
  autoDisableInZeroState?: boolean;
}

export const TableSearch = forwardRef<HTMLInputElement, DataTableSearchProps>(
  ({ autoDisableInZeroState = true, disabled, ...props }, ref) => {
    const {
      updateTableQuery,
      tableQuery,
      shouldShowFilters = false
    } = useDataTable();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        ref={ref}
        onChange={handleSearch}
        value={tableQuery?.search}
        onClear={handleClear}
        disabled={isDisabled}
      />
    );
  }
);

TableSearch.displayName = 'TableSearch';
