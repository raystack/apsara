import { Flex } from "../../flex";
import styles from "../data-table.module.css";
import { TextAlignTopIcon, TextAlignBottomIcon } from "@radix-ui/react-icons";
import { Text } from "../../text";
import { Select } from "../../select";
import { IconButton } from "../../icon-button";
import {
  ColumnData,
  Sort,
  SortOrders,
  SortOrdersValues,
} from "../data-table.types";

export interface OrderingProps {
  columnList: ColumnData[];
  onChange: (columnId: string, order: SortOrdersValues) => void;
  value: Sort;
}

export function Ordering({ columnList, onChange, value }: OrderingProps) {
  function handleColumnChange(columnId: string) {
    onChange(columnId, value.order);
  }

  function handleOrderChange() {
    const newOrder =
      value.order === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC;
    onChange(value.key, newOrder);
  }

  return (
    <Flex justify="between" align="center">
      <Text size={2} weight={500} className={styles["flex-1"]}>
        Ordering
      </Text>
      <Flex gap={"extra-small"} className={styles["flex-1"]}>
        <Select
          onValueChange={handleColumnChange}
          value={value.key}
          disabled={columnList.length === 0}
        >
          <Select.Trigger
            size={"small"}
            className={styles["display-popover-properties-select"]}
            with-icon-button="true"
          >
            <Select.Value placeholder="Select value" />
          </Select.Trigger>
          <Select.Content data-variant="filter">
            {columnList.map((column) => (
              <Select.Item key={column.id} value={column.id}>
                {column.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <IconButton
          onClick={handleOrderChange}
          size={4}
          disabled={columnList.length === 0}
        >
          {value.order === SortOrders?.ASC ? (
            <TextAlignBottomIcon
              className={styles["display-popover-sort-icon"]}
            />
          ) : (
            <TextAlignTopIcon className={styles["display-popover-sort-icon"]} />
          )}
        </IconButton>
      </Flex>
    </Flex>
  );
}
