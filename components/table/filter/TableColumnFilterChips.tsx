import { PlusIcon } from "@radix-ui/react-icons";
import React, { useMemo } from "react";
import { Flex } from "~/components/flex";
import { useTable } from "../hooks/useTable";
import { getAllColumnsData } from "../utils/column";
import { FilteredChip } from "./FilteredChip";
import TableFilterSelection from "./TableColumnFilterSelection";

export const TableColumnFilterChips = () => {
    const { table, filterQuery = [] } = useTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const allColumns = useMemo(() => getAllColumnsData(table), []);
    return (
        <Flex
            css={{
                padding: "$4 $6",
                flexDirection: "row",
                alignItems: "center",
                gap: "$2",
            }}
        >
            {filterQuery.map((q, index) => {
                const filteredColumn = table.getColumn(q.key)!;

                return (
                    <Flex css={{ display: "inline-flex", flexDirection: "row" }} key={`${q.key}_${index}`}>
                        <FilteredChip column={filteredColumn} columnQuery={q} index={index} />
                    </Flex>
                );
            })}
            {filterQuery.length < allColumns.length && (
                <TableFilterSelection align="end">
                    <Flex align="center">
                        <PlusIcon width={16} height={16} />
                    </Flex>
                </TableFilterSelection>
            )}
        </Flex>
    );
};
