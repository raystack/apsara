import { innerJoin } from "ramda";
import type { ReactNode } from "react";
import React, { useMemo } from "react";
import type { DropdownMenuContentProps } from "~/components/dropdownmenu";
import { DropdownMenu } from "~/components/dropdownmenu";
import { useTable } from "../hooks/useTable";
import { getAllColumnsData } from "../utils/column";

type TableFilterSelectionProps = DropdownMenuContentProps & {
    children?: ReactNode;
};
const TableFilterSelection = ({ children, ...props }: TableFilterSelectionProps) => {
    const { table, filterQuery = [], setFilterQuery } = useTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const allColumns = useMemo(() => getAllColumnsData(table), []);
    const filteredColumns = filterQuery.length
        ? innerJoin(
              (record, key) => record.key !== key,
              allColumns,
              filterQuery.map((fq) => fq.key),
          )
        : allColumns;

    const onMenuSelect = (key: string) => {
        setFilterQuery([...filterQuery, { key: key, operator: "==", value: "" }]);
    };

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
            <DropdownMenu.Content {...props}>
                <DropdownMenu.Group>
                    {filteredColumns.map((column, index) => {
                        return (
                            <DropdownMenu.Item key={column.key} onSelect={() => onMenuSelect(column.value)}>
                                {column.name}
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
};

export default TableFilterSelection;
