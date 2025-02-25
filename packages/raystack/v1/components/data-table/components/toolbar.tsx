import clsx from "clsx";
import { Flex } from "../../flex";
import styles from "../data-table.module.css";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { DisplaySettings } from "./display-settings";
import { DropdownMenu } from "../../dropdown-menu";
import { useDataTable } from "../hooks/useDataTable";

function Filters() {
  const { table } = useDataTable();
  const columns = table?.getAllColumns();

  const columnList = columns?.map((column) => {
    const id = column.id;
    return {
      label: (column.columnDef.header as string) || id,
      id: id,
    };
  });
  return (
    <Flex>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant={"text"} size={"small"} leadingIcon={<FilterIcon />}>
            Filter
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {columnList?.map((column) => (
            <DropdownMenu.Item key={column.id}>
              {column.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </Flex>
  );
}

export function Toolbar({ className }: { className?: string }) {
  return (
    <Flex
      className={clsx(styles["toolbar"], className)}
      justify={"between"}
      align={"center"}
    >
      <Filters />
      <DisplaySettings />
    </Flex>
  );
}
