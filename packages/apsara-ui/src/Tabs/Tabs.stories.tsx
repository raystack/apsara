import React from "react";

import Tabs from "./Tabs";

export default {
    title: "Navigation/Tabs",
    component: Tabs,
};

export const primary = () => (
    <>
        <Tabs>
            <Tabs.TabPane tab="tab1" key="tab1">
                Tab 1
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab2" key="tab2">
                Tab 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab3" key="tab3">
                Tab 3
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab4" key="tab4">
                Tab 4
            </Tabs.TabPane>
        </Tabs>
    </>
);

export const secondary = () => (
    <>
        <Tabs type="secondary">
            <Tabs.TabPane tab="tab1" key="tab1">
                Tab 1
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab2" key="tab2">
                Tab 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab3" key="tab3">
                Tab 3
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab4" key="tab4">
                Tab 4
            </Tabs.TabPane>
        </Tabs>
    </>
);
