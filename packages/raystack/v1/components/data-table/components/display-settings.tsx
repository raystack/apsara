import { Flex } from "../../flex";
import styles from "../data-table.module.css";
import { Button } from "../../button";
import { Popover } from "../../popover";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useDataTable } from "../hooks/useDataTable";
import {
  DataTableColumn,
  SortOrdersValues,
  defaultGroupOption,
} from "../data-table.types";
import { Ordering } from "./ordering";
import { Grouping } from "./grouping";
import { DisplayProperties } from "./display-properties";

export function DisplaySettings<TData, TValue>() {
  const {
    table,
    updateTableQuery,
    tableQuery,
    defaultSort,
    onDisplaySettingsReset,
  } = useDataTable();
  const columns = table?.getAllColumns() as DataTableColumn<TData, TValue>[];

  const sortableColumns = columns
    ?.filter((col) => col.columnDef.enableSorting)
    ?.map((column) => {
      const id = column.id;
      return {
        label: column.columnDef.header || id,
        id: id,
      };
    });

  function onSortChange(columnId: string, order: SortOrdersValues) {
    updateTableQuery((query) => {
      return {
        ...query,
        sort: [{ name: columnId, order }],
      };
    });
  }

  function onGroupChange(columnId: string) {
    updateTableQuery((query) => {
      return {
        ...query,
        group_by: [columnId],
      };
    });
  }

  function onGroupRemove() {
    updateTableQuery((query) => {
      return {
        ...query,
        group_by: [],
      };
    });
  }

  function onReset() {
    onDisplaySettingsReset();
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
              columnList={sortableColumns}
              onChange={onSortChange}
              value={tableQuery?.sort?.[0] || defaultSort}
            />
            <Grouping
              columns={columns}
              onRemove={onGroupRemove}
              onChange={onGroupChange}
              value={tableQuery?.group_by?.[0] || defaultGroupOption.id}
            />
          </Flex>
          <Flex className={styles["display-popover-properties-container"]}>
            <DisplayProperties columns={columns} />
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
