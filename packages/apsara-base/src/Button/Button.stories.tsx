import React from "react";

import Button from "./Button";
import Text from "../Text";

export default {
    title: "General/Button",
    component: Button,
};

export const Primary = () => (
    <Button type="primary">
        <Text size={11}>Hello</Text>
    </Button>
);
