import React from "react";
import Badge from "./DotBadge";
import Button from "../Button";

export default {
    title: "Feedback/Badge",
    component: Badge,
};
export const DotBadge = () => (
    <span style={{ position: "absolute" }}>
        <Badge dot={true}>
            <Button type="default">DotBadge</Button>
        </Badge>
    </span>
);
