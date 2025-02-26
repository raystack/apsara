import { Column } from "@tanstack/table-core";
import { Chip } from "../../chip";
import { Flex } from "../../flex";
import { Text } from "../../text";
import { ColumnData } from "../data-table.types";

export function DisplayProperties<TData, TValue>({
  columns,
}: {
  columns: Column<TData, TValue>[];
}) {
  const hidableColumns = columns?.filter((col) => col.columnDef.enableHiding);

  return (
    <Flex direction={"column"} gap={3}>
      <Text>Display Properties</Text>
      <Flex gap={3}>
        {hidableColumns.map((column) => (
          <Chip
            key={column.id}
            variant="outline"
            size="small"
            style={column.getIsVisible() ? "accent" : "neutral"}
            onClick={() => column.toggleVisibility()}
          >
            {(column.columnDef.header as string) || column.id}
          </Chip>
        ))}
      </Flex>
    </Flex>
  );
}
