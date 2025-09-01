'use client';

import { forwardRef } from 'react';
import { Search } from '../../search';
import { SearchProps } from '../../search/search';
import { useDataTable } from '../hooks/useDataTable';

export const TableSearch = forwardRef<HTMLInputElement, SearchProps>(
  ({ ...props }, ref) => {
    const { updateTableQuery, tableQuery } = useDataTable();

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

    return (
      <Search
        {...props}
        ref={ref}
        onChange={handleSearch}
        value={tableQuery?.search}
        onClear={handleClear}
      />
    );
  }
);
