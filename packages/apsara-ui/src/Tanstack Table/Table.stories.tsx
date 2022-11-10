import React from "react";

import Table from "./Table";
import { QueryClient, QueryClientProvider } from "react-query";

export default {
    title: "Data Display/TanstackTable",
    component: Table,
};

export const TableWithoutData = () => (
    <QueryClientProvider client={queryClient}>
        <Table columnsData={[]} />
    </QueryClientProvider>
);
const queryClient = new QueryClient();

function getPaginatedData(options: { pageIndex?: number; pageSize?: number }) {
    const items = new Array(1000).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            age: index,
            full_address: "10 Downing Street",
        };
    });

    if ((!options.pageIndex && options.pageIndex != 0) || !options.pageSize)
        return { rows: items, pageCount: 1, total: items.length };

    return {
        rows: items.slice(options.pageIndex * options.pageSize, (options.pageIndex + 1) * options.pageSize),
        pageCount: Math.ceil(items.length / options.pageSize),
        total: items.length,
    };
}

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "full_address",
    },
];

export const TableWithData = () => (
    <QueryClientProvider client={queryClient}>
        <Table
            columnsData={columns}
            scroll={{ x: true, y: 300 }}
            sortable={true}
            paginate={true}
            fullPagination={true}
            showPageSizeChanger={true}
            dataFetchFunction={getPaginatedData}
        />
    </QueryClientProvider>
);
