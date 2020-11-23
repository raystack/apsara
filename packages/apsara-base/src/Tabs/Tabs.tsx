import React from "react";
import { Tabs } from "antd";
import "./style.less";

const { TabPane } = Tabs;

interface CustomTabsProps {
    type?: "primary" | "secondary" | "card" | "think";
    size?: "xs" | "md" | "lg";
    className?: string;
    children?: React.ReactNode;
}

// ? Types of tabs: primary, secondary, card, think
// ? Sizes of tabs: xs, md, lg
const CustomTabs = ({ type = "primary", size = "md", className = "", ...props }: CustomTabsProps) => (
    <Tabs className={`skeleton-tabs ${className} ${size} ${type}`} {...props} />
);

CustomTabs.TabPane = TabPane;
export default CustomTabs;
