import React, { useState } from "react";
import Listing from "./Listing";
import InfiniteListing from "./InfiniteListing";

export default {
    title: "Data Display/Listing",
    component: Listing,
};

interface User {
    key: number;
    name: string;
    status: "active" | "inactive";
    age: number;
    address: string;
}

function getData(page = 1): User[] {
    return new Array(page * 100).fill(0).map((_, index) => {
        return {
            key: index,
            name: `name ${index}`,
            status: index%2 ? "active" : "inactive",
            age: index,
            address: `A${index} Downing Street`,
        };
    });
}

const data = getData(1);

export const listing = () => (
    <Listing<User>
        loading={false}
        sortable
        defaultSearchTerm="name 1"
        list={data}
        tableProps={{
            getColumnList: () => {
                return [
                    {
                        title: "Name",
                        key: "name",
                        render: ({ row: { original } }) => original.name,
                    },
                    {
                        title: "Status",
                        key: "status",
                        render: ({ row: { original } }) => original.status,
                    },
                    {
                        title: "Age",
                        key: "age",
                        render: ({ row: { original } }) => original.age,
                    },
                    {
                        title: "Address",
                        key: "address",
                        render: ({ row: { original } }) => original.address,
                    },
                ];
            },
            scroll: { y: 300, x: "100vw" },
        }}
        filterProps={{
            filterFieldList: [
                {
                    name: "Status",
                    data: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
                    slug: "status",
                    multi: true,
                },
            ],
        }}
        searchProps={{
            searchFields: ["name", "address"],
        }}
        resourcePath="/beast"
    />
);

export const infiniteListing = () => {
    const [page, setPage] = useState(1);
    async function loadMore(data: any) {
        console.log(data);
        setPage(data.nextPage);
    }

    function onSearchFilter(data: any) {
        console.log(data);
    }

    return (
        <InfiniteListing
            loading={false}
            list={getData(page)}
            tableProps={{
                getColumnList: () => {
                    return [
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
                },
                scroll: { y: 500, x: "100vw" },
            }}
            filterProps={{
                filterFieldList: [
                    {
                        name: "Age",
                        data: ["10", "20"].map((d) => {
                            return { label: d, value: d.toLowerCase() };
                        }),
                        slug: "age",
                    },
                ],
            }}
            resourcePath="/beast"
            page={page}
            loadMore={loadMore}
            onSearch={onSearchFilter}
            onFilter={onSearchFilter}
        />
    );
};

export const infiniteListingWithApply = () => {
    const [page, _setPage] = useState(1); // eslint-disable-line

    function handleApply(data: any) {
        console.log(data);
    }

    return (
        <InfiniteListing
            loading={false}
            list={getData(page)}
            tableProps={{
                getColumnList: () => {
                    return [
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
                },
                scroll: { y: 500, x: "100vw" },
            }}
            filterProps={{
                filterFieldList: [
                    {
                        name: "Age",
                        data: ["10", "20"].map((d) => {
                            return { label: d, value: d.toLowerCase() };
                        }),
                        slug: "age",
                    },
                ],
            }}
            resourcePath="/beast"
            page={page}
            onApply={handleApply}
        />
    );
};
