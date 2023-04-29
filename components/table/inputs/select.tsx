import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Box } from "~/components/box";
import { Text } from "~/components/text";
import { TextField } from "~/components/textfield";

import React from "react";
import { DropdownMenu } from "~/components/dropdownmenu";
import type { TableColumnMetadata } from "~/types/types";

type ColumnDropdownProps = {
    name: string | ReactNode;
    data: TableColumnMetadata[];
    onMenuSelect: (value: string) => void;
    search?: boolean;
};

const ColumnDropdown = ({ name, data, onMenuSelect, search = true }: ColumnDropdownProps) => {
    const [selectValues, setSelectValues] = useState(data);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const filteredValues = data.filter((fv) => fv.value.includes(searchValue));
        setSelectValues(filteredValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Text css={{ padding: "$1 $2", lineHeight: "normal" }}>{name}</Text>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
                <Box css={{ px: "$2" }}>
                    <TextField value={searchValue} onChange={onChange} css={{ height: "20px" }} />
                </Box>
                <DropdownMenu.Group>
                    {selectValues.map((column, _index) => (
                        <DropdownMenu.Item key={`${column.key}_${_index}`} onSelect={() => onMenuSelect(column.value)}>
                            {column.name}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
};

type Props = {
    value: any;
    data: TableColumnMetadata[];
    onChangeValue: (value: any) => void;
};
export function SelectInput({ onChangeValue, data, value }: Props) {
    return <ColumnDropdown name={value || "0 selected"} data={data} onMenuSelect={onChangeValue}></ColumnDropdown>;
}
