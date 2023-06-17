import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/table-core";
import React from "react";

/**
 * Generic column to use when your table needs multi selection of rows
 */
export const TableSelectableColumn: ColumnDef<unknown> = {
  id: "select",
  enableSorting: false,
  header: ({ table }) => {
    const label = table.getIsAllRowsSelected()
      ? "Unselect all from this page"
      : "Select all from this page";
    return (
      <Checkbox.Root
        aria-label={label}
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    );
  },
  cell: ({ row }) => (
    <Checkbox.Root
      aria-label="Select row"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  ),
};
