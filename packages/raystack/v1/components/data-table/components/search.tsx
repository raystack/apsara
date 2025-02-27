import { Search } from "../../search";
import { SearchProps } from "../../search/search";
import { useDataTable } from "../hooks/useDataTable";

export function TableSearch({ ...props }: SearchProps) {
  const { updateTableState } = useDataTable();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTableState((state) => {
      return {
        ...state,
        search: value,
      };
    });
  };

  return <Search {...props} onChange={handleSearch} />;
}
