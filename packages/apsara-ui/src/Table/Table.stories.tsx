import React, { useState } from "react";

import Table from "./Table";
import VTable from "./VirtualisedTable";

export default {
    title: "Data Display/Table",
    component: VTable,
};

export const TableWithoutData = () => <Table items={[]} />;

function getData(page = 1) {
    return new Array(page * 100).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            age: index,
            address: "10 Downing Street",
        };
    });
}

const dataSource = getData();

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

export const TableWithData = () => <Table items={dataSource} columns={columns} scroll={{ x: true, y: 300 }} />;
export const VirtualTableWithData = () => <VTable items={dataSource} columns={columns} />;

export const VirtualTableWithInfiniteData = () => {
    const [page, setPage] = useState(1);
    async function loadMore() {
        setPage(page + 1);
    }
    return <VTable items={getData(page)} columns={columns} loadMore={loadMore} alternate alternateHover />;
};
