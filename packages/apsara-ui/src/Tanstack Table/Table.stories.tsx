import React from "react";

import Table from "./Table";
import { QueryClient, QueryClientProvider } from "react-query";
import VirtualTable from "./VirtualisedTable";

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
    const items = new Array(10000).fill(0).map((_, index) => {
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

function rowClick(props: any) {
    console.log(props.original);
}

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: function Render({ row }) {
            return <a href="/">{row.original.name}</a>;
        },
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
            rowClick={rowClick}
            dataFetchFunction={getPaginatedData}
        />
    </QueryClientProvider>
);

export const VirtualTableWithData = () => (
    <VirtualTable
        columnsData={columns}
        scroll={{ x: true, y: 300 }}
        sortable={true}
        dataFetchFunction={getPaginatedData}
    />
);
