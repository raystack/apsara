import { Chip } from "../../chip";
import { Flex } from "../../flex";
import { Text } from "../../text";
import { ColumnData } from "../data-table.types";

export function DisplayProperties({
  columnList,
}: {
  columnList: ColumnData[];
}) {
  return (
    <Flex direction={"column"} gap={3}>
      <Text>Display Properties</Text>
      <Flex gap={3}>
        {columnList.map((column) => (
          <Chip
            key={column.id}
            variant="outline"
            size="small"
            style={column.isVisible ? "accent" : "neutral"}
          >
            {column.label}
          </Chip>
        ))}
      </Flex>
    </Flex>
  );
}
