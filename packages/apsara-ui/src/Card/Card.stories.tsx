import React from "react";
import Card from "./Card";

export default {
    title: "Data Display/Card",
    component: Card,
};

export const card = () => {
    const body = <div>card content</div>;
    return (
        <Card title="Card Title" headStyle={{ fontWeight: "bold" }} style={{ width: "300px" }}>
            {body}
        </Card>
    );
};
