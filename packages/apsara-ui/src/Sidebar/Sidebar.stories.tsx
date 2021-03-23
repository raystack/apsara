import React from "react";
import Sidebar from "./Sidebar";
import Icon from "../Icon";
import Colors from "../Colors";

export default {
    title: "Layout/Sidebar",
    component: Sidebar,
};

const LinkRender = ({ children, to }: any) => {
    console.log(to);
    return <React.Fragment>{children}</React.Fragment>;
};

export const sidebarWithIconComponent = () => (
    <Sidebar
        headerProps={{
            name: "Console",
            iconComponent: <Icon name="doc" size={32} styleOverride={{ color: Colors.primary[300] }} />,
        }}
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

export const sidebar = () => (
    <Sidebar
        headerProps={{
            name: "Console",
            icon: { name: "doc", color: Colors.primary[300], size: 32 },
        }}
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
