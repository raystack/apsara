import clsx from "clsx";
import { Flex } from "../flex";
import styles from "./data-table.module.css";
import { Button } from "../button";
import { Popover } from "../popover";
import { FilterIcon } from "../icons";
import {
  MixerHorizontalIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";
import { Text } from "../text";
import { Label } from "../label";
import { Select } from "../select";
import { Chip } from "../chip";
import { useDataTable } from "./hooks/useDataTable";

interface ColumnData {
  label: string;
  id: string;
  isVisible: boolean;
}

function Ordering({ columnList }: { columnList: ColumnData[] }) {
  return (
    <Flex justify="between" align="center">
      <Text size={2} weight={500} className={styles["flex-1"]}>
        Ordering
      </Text>
      <Flex gap={"extra-small"} className={styles["flex-1"]}>
        <Select>
          <Select.Trigger
            variant="filter"
            className={styles["display-popover-properties-select"]}
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
        <TextAlignBottomIcon className={styles["display-popover-sort-icon"]} />
      </Flex>
    </Flex>
  );
}

function Grouping({ columnList }: { columnList: ColumnData[] }) {
  return (
    <Flex justify="between" align="center">
      <Text size={2} weight={500} className={styles["flex-1"]}>
        Grouping
      </Text>
      <Flex className={styles["flex-1"]}>
        <Select>
          <Select.Trigger
            variant="filter"
            className={styles["display-popover-properties-select"]}
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
      </Flex>
    </Flex>
  );
}

function DisplayProperties({ columnList }: { columnList: ColumnData[] }) {
  return (
    <Flex direction={"column"} gap={3}>
      <Label>Display Properties</Label>
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

function DisplaySettings() {
  const { table } = useDataTable();
  const columns = table?.getAllColumns();

  const columnList = columns?.map((column) => {
    const id = column.id;
    return {
      label: (column.columnDef.header as string) || id,
      id: id,
      isVisible: column.getIsVisible(),
    };
  });

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button
          variant={"outline"}
          color="neutral"
          size={"small"}
          leadingIcon={<MixerHorizontalIcon />}
        >
          Display
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className={styles["display-popover-content"]}
        align="end"
      >
        <Flex direction={"column"}>
          <Flex
            direction={"column"}
            className={styles["display-popover-properties-container"]}
            gap={5}
          >
            <Ordering columnList={columnList} />
            <Grouping columnList={columnList} />
          </Flex>
          <Flex className={styles["display-popover-properties-container"]}>
            <DisplayProperties columnList={columnList} />
          </Flex>
          <Flex
            justify={"end"}
            className={styles["display-popover-reset-container"]}
          >
            <Button variant={"text"}>Reset to default</Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover>
  );
}

export function Toolbar({ className }: { className?: string }) {
  return (
    <Flex
      className={clsx(styles["toolbar"], className)}
      justify={"between"}
      align={"center"}
    >
      <Flex>
        <Button variant={"text"} size={"small"} leadingIcon={<FilterIcon />}>
          Filter
        </Button>
      </Flex>
      <DisplaySettings />
    </Flex>
  );
}
