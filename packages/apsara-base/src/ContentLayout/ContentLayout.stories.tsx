import React from "react";
import ContentLayout from "./ContentLayout";
import Listing from "../Listing";
import Button from "../Button";

export default {
    title: "Layout/ContentLayout",
    component: ContentLayout,
};

export const layout = () => (
    <>
        <ContentLayout siderProps={{ width: 310 }}>
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
            <div style={{ textAlign: "center", paddingTop: "100px", paddingLeft: "48px" }}>
                <Button type="primary" style={{ fontSize: "16px", width: "100%", height: "40px" }}>
                    Create a new resource
                </Button>
            </div>
        </ContentLayout>
    </>
);
