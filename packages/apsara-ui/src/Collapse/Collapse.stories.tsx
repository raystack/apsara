import React from "react";
import Collapse from "./Collapse";

export default {
    title: "General/Collapse",
    component: Collapse,
};

export const collapse = () => {
    const body = (
        <div>
            <div>collapse content</div>
            <div>collapse content</div>
            <div>collapse content</div>
            <div>collapse content</div>
        </div>
    );
    return (
        <Collapse header="Collapse header" contentForceMount headerStyle={{ fontWeight: "bold" }}>
            {body}
        </Collapse>
    );
};
