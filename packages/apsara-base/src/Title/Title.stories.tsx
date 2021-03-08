import React from "react";

import Title from "./Title";

export default {
    title: "General/Title",
    component: Title,
};

export const title = () => {
    return (
        <>
            <Title title="Title" />
            <Title title="Title" icon={{ name: "checkcircle", color: "#3AC581" }} />
            <Title title="Title" icon={{ name: "crossfilled", color: "red" }} />
            <Title title="Title" icon={{ name: "checkcircle", color: "#3AC581" }} status="to infinity and beyond" />
            <Title
                title="Icon with tooltip"
                icon={{ name: "checkcircle", color: "#3AC581" }}
                status="to infinity and beyond"
                iconToolTipText="Running"
            />
        </>
    );
};
