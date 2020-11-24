import React from "react";

import Title from "./Title";

export default {
    title: "General/Title",
    component: Title,
};

export const title = () => {
    return (
        <>
            <Title title="title" />
            <Title title="title" icon={{ name: "checkcircle", color: "#3AC581" }} />
            <Title title="title" icon={{ name: "crossfilled", color: "red" }} />
            <Title title="title" icon={{ name: "checkcircle", color: "#3AC581" }} status="to infinity and beyond" />
            <Title
                title="icon with tooltip"
                icon={{ name: "checkcircle", color: "#3AC581" }}
                status="to infinity and beyond"
                iconToolTipText="Running"
            />
        </>
    );
};
