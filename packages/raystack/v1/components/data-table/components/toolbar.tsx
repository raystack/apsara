import clsx from "clsx";
import { Flex } from "../../flex";
import styles from "./data-table.module.css";
import { Button } from "../../button";
import { FilterIcon } from "../../icons";
import { useEffect, useState } from "react";
import { Sort, SortOrdersValues } from "../data-table.types";
import { DisplaySettings } from "./display-settings";

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
