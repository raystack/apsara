import React from "react";
import { Flex } from "~/components/flex";
import { Label } from "~/components/label";
import { Popover } from "~/components/popover";
import { useTable } from "../hooks/useTable";

export default function TableColumnsFilter({ children }: any) {
  const { table } = useTable();
  return (
    <Popover modal>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content css={{ padding: "$2" }}>
        <Flex direction="column" css={labelContainer}>
          <Label css={labelStyle}>
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
              style={{ margin: 0 }}
            />
            Toggle All
          </Label>
          {table.getAllLeafColumns().map((column) => {
            return (
              <Label css={labelStyle} key={column.id}>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                  style={{ margin: 0 }}
                />
                {column.id}
              </Label>
            );
          })}
        </Flex>
      </Popover.Content>
    </Popover>
  );
}

const labelContainer = {
  maxHeight: "16rem",
  overflow: "scroll",

  input: {
    marginRight: "$2",
  },
};
const labelStyle = {
  display: "flex !important",
  align: "center",
  padding: "$2",
  gap: "$2",
};
