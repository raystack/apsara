import React from "react";
import Sidebar from "./Sidebar";

export default {
    title: "General/Sidebar",
    component: Sidebar,
};

const LinkRender = ({ children, to }: any) => {
    console.log(to);
    return <React.Fragment>{children}</React.Fragment>;
};

export const sidebar = () => (
    <Sidebar
        headerProps={{ name: "Console", logo: "" }}
        linkRender={LinkRender}
        activePath={"discovery"}
        onItemClick={() => null}
        navigationList={[
            {
                key: "discovery",
                url: "/discovery/",
                linkText: "Discovery",
                icon: "discovery",
            },
            {
                key: "dashboard",
                url: "/dashboard/",
                linkText: "Dashboard",
                icon: "dashboard",
            },
            {
                key: "health",
                url: "/health/",
                linkText: "Health",
                icon: "health",
            },
        ]}
    />
);
