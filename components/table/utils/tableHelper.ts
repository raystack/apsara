import type { Row } from "@tanstack/react-table";
import { assoc, curry, map, propEq, when } from "ramda";

const contains = <TData extends Record<string, any> = {}>(
    row: Row<TData>,
    id: string,
    filterValue: string | number,
) => {
    return row
        .getValue<string | number>(id)
        .toString()
        .toLowerCase()
        .trim()
        .includes(filterValue.toString().toLowerCase().trim());
};

contains.autoRemove = (val: any) => !val;

const startsWith = <TData extends Record<string, any> = {}>(
    row: Row<TData>,
    id: string,
    filterValue: string | number,
) => {
    return row
        .getValue<string | number>(id)
        .toString()
        .toLowerCase()
        .trim()
        .startsWith(filterValue.toString().toLowerCase().trim());
};

startsWith.autoRemove = (val: any) => !val;

export const alter = curry((checked, key, items) => map(when(propEq("key", key), assoc("good", checked)), items));

export const filterFns = {
    contains,
    startsWith,
};
