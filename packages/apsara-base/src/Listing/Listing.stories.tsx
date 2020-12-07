import React from "react";
import Listing from "./Listing";

export default {
    title: "Data Display/Listing",
    component: Listing,
};

export const Keyboard = () => (
    <Listing
        loading={false}
        list={new Array(100).fill(0).map((_, index) => {
            return {
                id: index,
                name: `name ${index}`,
                class: index % 2 === 0 ? "active" : "inactive",
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
