import React from "react";

import Table from "./Table";
import { QueryClient, QueryClientProvider } from "react-query";
import VirtualisedTable from "./VirtualisedTable";
import VirtualisedTableWithInfiniteScroll from "./VirtualisedTableWithInfiniteData";
import { ColumnSort, SortingState } from "@tanstack/react-table";

export default {
    title: "Data Display/TableV2",
    component: Table,
};

function getData(page = 1) {
    return new Array(page * 100).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            age: index,
            full_address: "10 Downing Street",
        };
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dataSource = getData();

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

function getInfiniteData(start: number, size: number, sorting: SortingState) {
    const items = new Array(1000).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            age: index,
            full_address: "10 Downing Street",
        };
    });

    if (sorting.length) {
        const sort = sorting[0] as ColumnSort;
        const { id, desc } = sort as { id: any; desc: boolean };
        items.sort((a, b) => {
            if (desc) {
                return a[id] < b[id] ? 1 : -1;
            }
            return a[id] > b[id] ? 1 : -1;
        });
    }

    return {
        data: items.slice(start, start + size),
        meta: {
            totalRowCount: items.length,
        },
    };
}

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: function Render({ row }: any) {
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

export const TableWithDataWithoutPagination = () => (
    <QueryClientProvider client={queryClient}>
        <Table
            columnsData={columns}
            scroll={{ x: true, y: 300 }}
            sortable={true}
            paginate={false}
            fullPagination={false}
            showPageSizeChanger={false}
            rowClick={rowClick}
            dataFetchFunction={getPaginatedData}
            alternate
        />
    </QueryClientProvider>
);

export const VirtualTableWithData = () => (
    <VirtualisedTable
        columnsData={columns}
        scroll={{ x: true, y: 300 }}
        sortable={true}
        dataFetchFunction={getPaginatedData}
    />
);

export const VirtualTableWithInfiniteData = () => (
    <QueryClientProvider client={queryClient}>
        <VirtualisedTableWithInfiniteScroll
            columnsData={columns}
            scroll={{ x: true, y: 300 }}
            sortable={true}
            dataFetchFunction={getInfiniteData}
            fetchSize={50}
        />
    </QueryClientProvider>
);
