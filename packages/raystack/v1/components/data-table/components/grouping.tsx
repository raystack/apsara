import { Flex } from "../../flex";
import styles from "./data-table.module.css";
import { Text } from "../../text";
import { Select } from "../../select";
import { ColumnData } from "../data-table.types";
import { defaultGroupOption } from "../utils";

interface GroupingProps {
  columnList: ColumnData[];
  onChange: (columnId: string) => void;
  value: string;
}

export function Grouping({ columnList, onChange, value }: GroupingProps) {
  return (
    <Flex justify="between" align="center">
      <Text size={2} weight={500} className={styles["flex-1"]}>
        Grouping
      </Text>
      <Flex className={styles["flex-1"]}>
        <Select onValueChange={onChange} value={value}>
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
