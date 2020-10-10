import React from "react";

import Listing from "./Listing";

export default {
    title: "General/Listing",
    component: Listing,
};

export const Keyboard = () => (
    <Listing
        loading={false}
        list={[
            {
                id: 1,
                name: "first",
                class: "active",
            },
            {
                id: 2,
                name: "second",
                class: "inactive",
            },
            {
                id: 3,
                name: "third",
                class: "inactive",
            },
        ]}
        getColumnList={() => {
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
        }}
        filterFieldList={[
            {
                name: "Status",
                data: ["active", "inactive"].map((d) => {
                    return { label: d, value: d.toLowerCase() };
                }),
                slug: "class",
            },
        ]}
        searchFields={["name", "class"]}
        resourceName="beast"
        resourcePath="/beast"
    />
);
