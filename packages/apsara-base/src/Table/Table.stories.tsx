import React from "react";

import Table from "./Table";
import VTable from "./VirtualisedTable";

export default {
    title: "Data Display/Table",
    component: VTable,
};

export const TableWithoutData = () => <Table items={[]} />;

const dataSource = new Array(100).fill(0).map((_, index) => {
    return {
        key: index,
        name: `name ${index}`,
        age: 32,
        address: "10 Downing Street",
    };
});
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
        key: "address",
    },
];

export const TableWithData = () => <Table items={dataSource} columns={columns} />;
export const VirtualTableWithData = () => <VTable items={dataSource} columns={columns} />;
