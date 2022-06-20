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

export const iconComponent = () => (
    <Sidebar
        headerProps={{
            name: "Console",
            icon: <Icon name="doc" size={32} styleOverride={{ color: Colors.light.primary[3] }} />,
        }}
        linkRender={LinkRender}
        activePath={"discovery"}
        onItemClick={() => null}
        navigationList={[
            {
                key: "discovery",
                url: "/discovery/",
                linkText: "Discovery",
                iconProps: { name: "discovery" },
            },
            {
                key: "dashboard",
                url: "/dashboard/",
                linkText: "Dashboard",
                iconProps: { name: "dashboard" },
            },
            {
                key: "dashboard",
                url: "/dashboard/",
                linkText: "Topics",
                iconProps: { name: "topic" },
                isSubMenu: true,
            },
            {
                key: "dashboard",
                url: "/dashboard/",
                linkText: "Tables",
                iconProps: { name: "warehouse" },
                isSubMenu: true,
            },
            {
                key: "health",
                url: "/health/",
                linkText: "Health",
                iconProps: { name: "health" },
            },
        ]}
    />
);

export const iconProps = () => (
    <Sidebar
        headerProps={{
            name: "Console",
            iconProps: { name: "doc", color: Colors.light.primary[3], size: 32 },
        }}
        linkRender={LinkRender}
        activePath={"discovery"}
        onItemClick={() => null}
        navigationList={[
            {
                key: "discovery",
                url: "/discovery/",
                linkText: "Discovery",
                iconProps: { name: "discovery" },
            },
            {
                key: "dashboard",
                url: "/dashboard/",
                linkText: "Dashboard",
                iconProps: { name: "dashboard" },
            },
            {
                key: "health",
                url: "/health/",
                linkText: "Health",
                iconProps: { name: "health" },
            },
        ]}
    />
);
