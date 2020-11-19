import React from "react";

import Drawer from "./Drawer";

export default {
    title: "General/Drawer",
    component: Drawer,
};

export const left = () => (
    <>
        <Drawer open position="left">
            <h1>Position Left</h1>
        </Drawer>
    </>
);

export const right = () => (
    <>
        <Drawer open>
            <h1>Position Right</h1>
        </Drawer>
    </>
);
