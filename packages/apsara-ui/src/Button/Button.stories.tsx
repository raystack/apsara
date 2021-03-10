import React from "react";

import Button from "./Button";

export default {
    title: "General/Button",
    component: Button,
};

const style = { marginRight: "10px", marginBottom: "10px" };

export const button = () => (
    <>
        <Button loading style={style}></Button>
        <Button type="primary" loading style={style}></Button>
        <div style={style}>
            <Button style={style} size="small">
                small Button
            </Button>
            <Button style={style}>normal Button</Button>
            <Button style={style} size="large">
                large Button
            </Button>
        </div>

        {/* primary variations */}
        <div style={style}>
            <Button style={style} size="small" type="primary">
                small Button
            </Button>
            <Button style={style} type="primary">
                normal Button
            </Button>
            <Button style={style} size="large" type="primary">
                large Button
            </Button>
        </div>
    </>
);
