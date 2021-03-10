import React from "react";

import Drawer from "./Drawer";

export default {
    title: "Feedback/Drawer",
    component: Drawer,
};

export const left = () => (
    <>
        <Drawer open position="left">
            position left
        </Drawer>
    </>
);

export const right = () => (
    <>
        <Drawer open>position right(default)</Drawer>
    </>
);
