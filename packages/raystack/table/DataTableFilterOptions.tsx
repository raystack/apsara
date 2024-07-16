import { PlusIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { Button } from "~/button";
import { DropdownMenu } from "~/dropdown-menu";
import { Flex } from "~/flex";
import { useTable } from "./hooks/useTable";

type DataTableFilterOptionsProps = ComponentProps<typeof Button>;
export function DataTableFilterOptions({
  children,
  ...props
}: DataTableFilterOptionsProps) {
  const { table, filteredColumns, addFilterColumn, isLoading } = useTable();
  const availableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" &&
        column.getCanHide() &&
        column.getCanFilter()
    )
    .filter((column) => !filteredColumns.includes(column.id));

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild disabled={isLoading}>
        <Button variant="ghost" {...props}>
          {children || (
            <Flex gap="small" align="center" justify="center">
              <PlusIcon width={12} height="12" /> Filter
            </Flex>
          )}
        </Button>
      </DropdownMenu.Trigger>

      {availableColumns.length ? (
        <DropdownMenu.Content align="end" className="w-[150px]">
          <DropdownMenu.Label>Filter column</DropdownMenu.Label>
          <DropdownMenu.Separator />
          {availableColumns.map((column) => {
            const columnHeader = column?.columnDef?.header;
            const columnName =
              (typeof columnHeader === "string" && columnHeader) || column.id;
            return (
              <DropdownMenu.Item
                key={column.id}
                onSelect={() => addFilterColumn(column.id)}
              >
                {columnName}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      ) : null}
    </DropdownMenu>
  );
}
