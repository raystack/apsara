import { Flex } from "../../flex";
import { Select } from "../../select";
import { Text } from "../../text";
import styles from "../data-table.module.css";
import {
  DataTableColumn,
  SortOrders,
  SortOrdersValues,
  defaultGroupOption,
} from "../data-table.types";

interface GroupingProps<TData, TValue> {
  columns: DataTableColumn<TData, TValue>[];
  onChange: (columnId: string) => void;
  onRemove: () => void;
  value: string;
}

export function Grouping<TData, TValue>({
  columns = [],
  onChange,
  onRemove,
  value,
}: GroupingProps<TData, TValue>) {
  const columnList = columns
    .filter((column) => column.columnDef.enableGrouping)
    ?.map((column) => {
      const id = column.id;
      return {
        label: column.columnDef.header || id,
        id: id,
      };
    });

  const handleGroupChange = (columnId: string) => {
    if (columnId === defaultGroupOption.id) {
      onRemove();
      return;
    }
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      onChange(column.id);
    }
  };

  return (
    <Flex justify="between" align="center">
      <Text size={2} weight={500} className={styles["flex-1"]}>
        Grouping
      </Text>
      <Flex className={styles["flex-1"]}>
        <Select onValueChange={handleGroupChange} value={value}>
          <Select.Trigger
            size={"small"}
            className={styles["display-popover-properties-select"]}
          >
            <Select.Value placeholder="Select value" />
          </Select.Trigger>
          <Select.Content data-variant="filter">
            <Select.Item value={defaultGroupOption.id}>
              {defaultGroupOption.label}
            </Select.Item>
            {columnList.map((column) => (
              <Select.Item key={column.id} value={column.id}>
                {column.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </Flex>
    </Flex>
  );
}
