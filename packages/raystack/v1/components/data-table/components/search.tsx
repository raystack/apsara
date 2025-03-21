import { forwardRef } from "react";
import { Search } from "../../search";
import { SearchProps } from "../../search/search";
import { useDataTable } from "../hooks/useDataTable";

const TableSearchBase = forwardRef<HTMLInputElement, SearchProps>(
  ({ ...props }, ref) => {
    const { updateTableQuery, tableQuery } = useDataTable();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateTableQuery((query) => {
        return {
          ...query,
          search: value,
        };
      });
    };

    const handleClear = () => {
      updateTableQuery((query) => {
        return {
          ...query,
          search: "",
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
export function TableSearch({ ...props }: SearchProps) {
  const { updateTableQuery, tableQuery } = useDataTable();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTableQuery((query) => {
      return {
        ...query,
        search: value,
      };
    });
  };

  const handleClear = () => {
    updateTableQuery((query) => {
      return {
        ...query,
        search: "",
      };
    });
  };

  return (
    <Search
      {...props}
      onChange={handleSearch}
      value={tableQuery?.search}
      onClear={handleClear}
    />
  );
}
