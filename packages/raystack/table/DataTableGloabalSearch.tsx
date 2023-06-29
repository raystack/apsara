import { ComponentProps } from "react";
import { TextField } from "~/textfield";
import { useTable } from "./hooks/useTable";

type DataTableGloabalSearchProps = ComponentProps<typeof TextField>;
export function DataTableGloabalSearch(props: DataTableGloabalSearchProps) {
  const { table, globalFilter, onGlobalFilterChange } = useTable();

  return (
    <TextField
      placeholder="Filter tasks..."
      value={globalFilter ?? ""}
      onChange={(event) => onGlobalFilterChange(String(event.target.value))}
      {...props}
    />
  );
}
