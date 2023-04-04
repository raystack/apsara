import React from "react";
import { Flex } from "~/components/flex";
import { Label } from "~/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/popover";
import { Separator } from "~/components/separator";
import { useTable } from "../hooks/useTable";

export default function TableColumnsFilter({ children }: any) {
    const { table } = useTable();
    return (
        <Popover modal>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent css={{ padding: "$4" }}>
                <Flex css={labelContainer}>
                    <Label css={labelStyle}>
                        <input
                            {...{
                                type: "checkbox",
                                checked: table.getIsAllColumnsVisible(),
                                onChange: table.getToggleAllColumnsVisibilityHandler(),
                            }}
                        />{" "}
                        Toggle All
                    </Label>
                    <Separator></Separator>
                    {table.getAllLeafColumns().map((column) => {
                        return (
                            <Label css={labelStyle} key={column.id}>
                                <input
                                    {...{
                                        type: "checkbox",
                                        checked: column.getIsVisible(),
                                        onChange: column.getToggleVisibilityHandler(),
                                    }}
                                />{" "}
                                {column.id}
                            </Label>
                        );
                    })}
                </Flex>
            </PopoverContent>
        </Popover>
    );
}

const labelContainer = {
    padding: "$8",
    maxHeight: "16rem",
    overflow: "scroll",

    input: {
        marginRight: "$8",
    },
};
const labelStyle = {
    display: "flex",
    align: "center",
    padding: "$4 $8",
};
