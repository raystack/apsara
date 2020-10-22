import React from "react";
import ContentLayout from "./ContentLayout";
import Listing from "../Listing";

import Markdown from "../Markdown";

export default {
    title: "General/ContentLayout",
    component: ContentLayout,
};

export const layout = () => (
    <>
        <ContentLayout siderProps={{ width: 250 }}>
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
            <Markdown
                style={{ height: "calc(100vh - 60px)" }}
                data={`<ol>
                    <li><p>What is Beast?</p>
                    <p>Beast is a fully managed data ingestion pipeline to BigQuery that minimizes latency, processing time, and operational overhead through autoscaling and one click deployments. With its cloud-native approach to resource provisioning and management, access to virtually limitless capacity to solve the biggest data ingestion challenges, ensuring Data Warehouse developer to simply focus on ETL management. <a target="_blank" href="http://data.golabs.io/products/beast/#introduction">Learn More</a></p>
                    </li>
                    <li><p>Why am not able to enable Beast for this topic?</p>
                    <p>As Beast is a product built for Data Warehouse Team, they want to keep checks on which data points are coming to BigQuery. Please raise a ticket at <a target="_blank" href="https://go-jek.atlassian.net/servicedesk/customer/portal/11/group/34">Data Warehouse Service Desk</a> with Topic, Proto mapping, Topic Description and Usage for deployment. <a target="_blank" href="http://data.golabs.io/products/beast/docs/beast-documentation-deploying-beast-from-data-console">Learn More</a></p>
                    </li>
                    <li><p>What are the features of Beast?</p>
                    <ul>
                    <li>Real-time ingestion</li>
                    <li>Zero data loss</li>
                    <li>Out of the box observability</li>
                    <li>Easy upgrades
                    <a target="_blank" href="http://data.golabs.io/products/beast/#key-features">Learn More</a></li>
                    </ul>
                    </li>
                    <li><p>What use-cases are powered by Beast?</p>
                    <ul>
                    <li>Data Warehouse @ Gojek</li>
                    <li>Analysis for Info Security</li>
                    <li>Data ingestion @ Mapan
                    <a target="_blank" href="http://data.golabs.io/products/beast/#customers">Learn More</a></li>
                    </ul>
                    </li>
                    <li><p>What is the SLO for Beast?</p>
                    <p>Read about the Site Reliability Engineering (SRE) for Beast <a target="_blank" href="http://data.golabs.io/products/beast/docs/resources/service-level-objectives-service-level-objectives">here</a>.</p>
                    </li>
                </ol>`}
            />
        </ContentLayout>
    </>
);
