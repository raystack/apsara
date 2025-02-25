import { Flex } from "../../flex";
import styles from "./data-table.module.css";
import { Button } from "../../button";
import { Popover } from "../../popover";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useDataTable } from "../hooks/useDataTable";
import { SortOrdersValues } from "../data-table.types";
import { defaultGroupOption } from "../utils";
import { Ordering } from "./ordering";
import { Grouping } from "./grouping";
import { DisplayProperties } from "./display-properties";

export function DisplaySettings() {
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
