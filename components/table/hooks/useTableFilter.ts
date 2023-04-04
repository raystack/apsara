import type { TableState } from "@tanstack/react-table";
import type { Dispatch } from "react";
import { useCallback, useEffect, useState } from "react";

export const INITIAL_QUERY = { key: "", operator: "", value: "" };

interface TableFilterProps {
    columns: [];
    state: TableState;
    setState: Dispatch<(prevState: TableState) => TableState>;
    defaultQuery?: (typeof INITIAL_QUERY)[];
}
export const useTableFilter = ({ columns = [], state, setState, defaultQuery }: TableFilterProps) => {
    const [query, setQuery] = useState<(typeof INITIAL_QUERY)[]>(defaultQuery || []);

    useEffect(() => {
        setState(() => ({
            ...state,
            columnFilters: query.map((q) => ({ id: q.key, value: q.value })),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const resetQuery = useCallback(() => setQuery([]), []);
    return {
        filterQuery: query,
        setFilterQuery: setQuery,
        resetQuery,
    };
};
