import { ColumnsIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "react";
import { Button } from "~/button";
import { Checkbox } from "~/checkbox";
import { DropdownMenu } from "~/dropdown-menu";
import { Flex } from "~/flex";
import { useTable } from "./hooks/useTable";

type DataTableViewOptionsProps = ComponentProps<typeof Button>;
export function DataTableViewOptions({
  children,
  ...props
}: DataTableViewOptionsProps) {
  const { table } = useTable();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" {...props}>
          {children || (
            <Flex gap="small" align="center" justify="center">
              <ColumnsIcon width={12} height="12" /> View
            </Flex>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" className="w-[150px]">
        <DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            onCheckedChange={table.getToggleAllColumnsVisibilityHandler()}
          >
            Toggle All
          </Checkbox>
        </DropdownMenu.Item>
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenu.Item key={column.id}>
                <Checkbox
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </Checkbox>
              </DropdownMenu.Item>
            );
          })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
