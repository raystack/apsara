import React from "react";

import Button from "./Button";

export default {
    title: "General/Button",
    component: Button,
};

const style = { marginRight: "10px" };

export const button = () => (
    <>
        <Button loading style={style}></Button>
        <Button type="primary" loading style={style}></Button>
        <Button style={style}>Button</Button>
    </>
);
