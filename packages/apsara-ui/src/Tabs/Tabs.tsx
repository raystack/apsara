import React from "react";
import { Tabs, TabsProps } from "antd";
import "./style.less";

const { TabPane } = Tabs;

interface CustomTabsProps extends Omit<TabsProps, "type" | "size"> {
    type?: "primary" | "secondary" | "card" | "think";
    size?: "xs" | "md" | "lg";
    className?: string;
    children?: React.ReactNode;
}

// ? Types of tabs: primary, secondary, card, think
// ? Sizes of tabs: xs, md, lg
function CustomTabs({ type = "primary", size = "md", className = "", ...props }: CustomTabsProps) {
    return <Tabs className={`skeleton-tabs ${className} ${size} ${type}`} {...props} />;
}

CustomTabs.TabPane = TabPane;
export default CustomTabs;
