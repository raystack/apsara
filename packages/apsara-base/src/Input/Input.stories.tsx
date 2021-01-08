import React from "react";

import Input from "./Input";

export default {
    title: "General/Input",
    component: Input,
};

export const input = () => (
    <>
        <Input placeholder="Default with Placeholder"></Input>
        <br />
        <br />
        <Input value="Default with Value"></Input>
        <br />
        <br />
        <Input placeholder="Disabled with Placeholder" disabled></Input>
        <br />
        <br />
        <Input value="Disabled with value" disabled></Input>
    </>
);
