import { Cross1Icon } from "@radix-ui/react-icons";
import type { Column, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import React from "react";
import { Box } from "~/components/box";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/dropdownmenu";
import { Flex } from "~/components/flex";
import { Text } from "~/components/text";
import type { TableColumnMetadata } from "~/types/types";
import { useTable } from "../hooks/useTable";
import type { INITIAL_QUERY } from "../hooks/useTableFilter";
import { SelectInput } from "../inputs/select";
import { TextInput } from "../inputs/text";
import type { RaypointColumnDef } from "../Table.types";
import { getColumnName } from "../utils/column";

type SelectKey = "key" | "operator" | "value";
const filterTypes: Record<string, any> = {
    "==": {
        key: "is",
        name: "is",
        value: "==",
    },
    "!=": {
        key: "isnot",
        name: "is not",
        value: "!=",
    },
};

type Props<T> = {
    column: Column<T, unknown>;
    columnQuery: typeof INITIAL_QUERY;
    index: number;
};
export function FilteredChip<T extends RowData>({ column, columnQuery, index }: Props<T>) {
    const { filterQuery = [], setFilterQuery } = useTable();
    const { filterVariant } = column?.columnDef as RaypointColumnDef;
    const columnMetaData: TableColumnMetadata[] = (column?.columnDef?.meta as any)?.data || [];

    const onMenuSelect = (index: number, id: SelectKey, value: string) => {
        const currentQuery = filterQuery[index];
        currentQuery[id] = value;

        setFilterQuery([...filterQuery.slice(0, index), currentQuery, ...filterQuery.slice(index + 1)]);
    };

    const onChangeValue = (value: any) => {
        const currentQuery = filterQuery[index];
        currentQuery["value"] = value;

        setFilterQuery([...filterQuery.slice(0, index), currentQuery, ...filterQuery.slice(index + 1)]);
    };

    const removeFilter = (index: number) => {
        setFilterQuery([...filterQuery.slice(0, index), ...filterQuery.slice(index + 1)]);
    };

    const renderInputs = () => {
        switch (filterVariant) {
            case "text": {
                return <TextInput onChangeValue={onChangeValue} />;
            }
            default: {
                return <SelectInput value={columnQuery.value} data={columnMetaData} onChangeValue={onChangeValue} />;
            }
        }
    };

    return (
        <Box
            css={{
                display: "inline-flex",
                flexDirection: "row",
                alignItems: "center",
                border: "1px solid $gray6",
                borderRadius: "$4",
            }}
        >
            <Text css={{ padding: "$4 $8", lineHeight: "normal" }}>{getColumnName(column)}</Text>

            <ColumnDropdown
                index={index}
                selectKey="operator"
                name={filterTypes[columnQuery.operator].name}
                data={Object.values(filterTypes)}
                onMenuSelect={onMenuSelect}
            ></ColumnDropdown>

            {/* render diffrent input base on filterVariant type */}
            {renderInputs()}

            {/* close filter chip */}
            <Flex css={{ padding: ".6rem" }}>
                <Cross1Icon height="12" width="12" onClick={() => removeFilter(index)} />
            </Flex>
        </Box>
    );
}

type ColumnDropdownProps = {
    selectKey: SelectKey;
    index: number;
    name: string | ReactNode;
    data: TableColumnMetadata[];
    onMenuSelect: (index: number, id: SelectKey, value: string) => void;
};

const ColumnDropdown = ({ index, name, data, onMenuSelect, selectKey }: ColumnDropdownProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Text css={{ padding: "$4 $8", lineHeight: "normal" }}>{name}</Text>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuGroup>
                {data.map((column, _index) => (
                    <DropdownMenuItem
                        key={`${column.key}_${_index}`}
                        onSelect={() => onMenuSelect(index, selectKey, column.value)}
                    >
                        {column.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
);
