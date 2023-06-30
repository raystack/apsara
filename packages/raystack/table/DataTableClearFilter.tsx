import { Cross2Icon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";
import { Button } from "~/button";
import { Flex } from "~/flex";
import { useTable } from "./hooks/useTable";

type DataTableClearFilterProps = PropsWithChildren<typeof Button>;

export function DataTableClearFilter({
  children,
  ...props
}: DataTableClearFilterProps) {
  const { resetColumns, table } = useTable();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        table.resetColumnFilters();
        resetColumns();
      }}
      style={{ width: "100%" }}
      {...props}
    >
      {children || (
        <Flex gap="small" align="center" justify="center">
          Clear filters <Cross2Icon width={12} height="12" />
        </Flex>
      )}
    </Button>
  );
}
