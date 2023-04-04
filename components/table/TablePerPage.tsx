import type { TableState } from "@tanstack/react-table";
import type { FunctionComponent } from "react";
import React from "react";
import { Box } from "~/components/box";
import { Text } from "~/components/text";
import { useTable } from "./hooks/useTable";

interface TablePerPageProps {
    /**
     * The label displayed before the control
     *
     * @default Results per page
     */
    label?: string;
    /**
     * The per page choices to display
     *
     * @default [25, 50, 100]
     */
    values?: number[];
}

export const TablePerPage: FunctionComponent<TablePerPageProps> & {
    DEFAULT_SIZE: number;
} = ({ label = "Results per page", values = [25, 50, 100] }) => {
    const { state, setState } = useTable();

    const updatePerPage = (newPerPage: string) => {
        setState((prevState: TableState) => ({
            ...prevState,
            pagination: { pageIndex: 0, pageSize: parseInt(newPerPage, 10) },
        }));
    };

    return (
        <Box>
            <Text>
                {label}: {state.pagination.pageSize.toString() ?? values?.[1].toString()}
            </Text>
        </Box>
    );
};

TablePerPage.DEFAULT_SIZE = 50;
