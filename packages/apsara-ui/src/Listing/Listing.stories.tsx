import React, { useState } from "react";
import Listing from "./Listing";
import InfiniteListing from "./InfiniteListing";

export default {
    title: "Data Display/Listing",
    component: Listing,
};

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

export const listing = () => (
    <Listing
        loading={false}
        sortable
        list={new Array(100).fill(0).map((_, index) => {
            return {
                id: index,
                name: `name ${index}`,
                class: index % 2 === 0 ? "active" : "inactive",
                isEven: index % 2 === 0 ? "true" : "false",
                address: "10 Downing Street",
            };
        })}
        tableProps={{
            getColumnList: () => {
                return [
                    {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                    },
                    {
                        title: "Class",
                        dataIndex: "class",
                        key: "class",
                    },
                    {
                        title: "is Even",
                        dataIndex: "isEven",
                        key: "isEven",
                    },
                ];
            },
            scroll: { y: 300, x: "100vw" },
        }}
        filterProps={{
            filterFieldList: [
                {
                    name: "Status",
                    data: ["active", "inactive", "foo", "bar", "a", "b", "c", "d"].map((d) => {
                        return { label: d, value: d.toLowerCase() };
                    }),
                    slug: "class",
                    multi: false,
                    searchEnabled: true,
                },
                {
                    name: "Is Even",
                    data: ["true", "false"].map((d) => {
                        return { label: d, value: d.toLowerCase() };
                    }),
                    slug: "isEven",
                },
            ],
        }}
        searchProps={{
            searchFields: ["name", "class"],
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
