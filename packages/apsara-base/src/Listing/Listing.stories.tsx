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
                    data: ["active", "inactive"].map((d) => {
                        return { label: d, value: d.toLowerCase() };
                    }),
                    slug: "class",
                    multi: false,
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
        resourceName="beast"
        resourcePath="/beast"
    />
);

export const infiniteListing = () => {
    const [page, setPage] = useState(1);
    async function loadMore(data) {
        console.log(data);
        setPage(data.nextPage);
    }

    function onSearchFilter(data) {
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
                            title: "Class",
                            dataIndex: "class",
                            key: "class",
                        },
                    ];
                },
                scroll: { y: 500, x: "100vw" },
            }}
            filterProps={{
                filterFieldList: [
                    {
                        name: "Status",
                        data: ["active", "inactive"].map((d) => {
                            return { label: d, value: d.toLowerCase() };
                        }),
                        slug: "class",
                    },
                ],
            }}
            resourceName="beast"
            resourcePath="/beast"
            page={page}
            loadMore={loadMore}
            onSearch={onSearchFilter}
            onFilter={onSearchFilter}
        />
    );
};
