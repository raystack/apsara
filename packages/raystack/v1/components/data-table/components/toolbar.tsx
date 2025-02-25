import clsx from "clsx";
import { Flex } from "../../flex";
import styles from "./data-table.module.css";
import { Button } from "../../button";
import { Popover } from "../../popover";
import { FilterIcon } from "../../icons";
import {
  MixerHorizontalIcon,
  TextAlignTopIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";
import { Text } from "../../text";
import { Label } from "../../label";
import { Select } from "../../select";
import { Chip } from "../../chip";
import { useDataTable } from "../hooks/useDataTable";
import { IconButton } from "../../icon-button";
import { useEffect, useState } from "react";
import { Sort, SortOrders, SortOrdersValues } from "../data-table.types";
import { defaultGroupOption } from "../utils";

interface ColumnData {
  label: string;
  id: string;
  isVisible: boolean;
}

interface OrderingProps {
  columnList: ColumnData[];
  onChange: (columnId: string, order: SortOrdersValues) => void;
  value: Sort;
}

function Ordering({ columnList, onChange, value }: OrderingProps) {
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
        <Select onValueChange={handleColumnChange} value={value.key}>
          <Select.Trigger
            size={"small"}
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
        <IconButton onClick={handleOrderChange} size={4}>
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

interface GroupingProps {
  columnList: ColumnData[];
  onChange: (columnId: string) => void;
  value: string;
}

function Grouping({ columnList, onChange, value }: GroupingProps) {
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
  const { table, updateTableState, tableState, defaultSort } = useDataTable();
  const columns = table?.getAllColumns();

  const columnList = columns?.map((column) => {
    const id = column.id;
    return {
      label: (column.columnDef.header as string) || id,
      id: id,
      isVisible: column.getIsVisible(),
    };
  });

  function onSortChange(columnId: string, order: SortOrdersValues) {
    updateTableState((state) => {
      return {
        ...state,
        sort: [{ key: columnId, order }],
      };
    });
  }

  function onGroupChange(columnId: string) {
    updateTableState((state) => {
      return {
        ...state,
        group_by: [columnId],
      };
    });
  }

  function onReset() {
    updateTableState((state) => {
      return {
        ...state,
        sort: [defaultSort],
        group_by: [defaultGroupOption.id],
      };
    });
  }

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
            <Ordering
              columnList={columnList}
              onChange={onSortChange}
              value={tableState.sort?.[0] || defaultSort}
            />
            <Grouping
              columnList={columnList}
              onChange={onGroupChange}
              value={tableState.group_by?.[0] || defaultGroupOption.id}
            />
          </Flex>
          <Flex className={styles["display-popover-properties-container"]}>
            <DisplayProperties columnList={columnList} />
          </Flex>
          <Flex
            justify={"end"}
            className={styles["display-popover-reset-container"]}
          >
            <Button variant={"text"} onClick={onReset}>
              Reset to default
            </Button>
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
