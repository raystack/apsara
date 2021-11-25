import React from "react";
import { TabsProps } from "antd";
import { StyledTabs } from "./Tabs.styles";

const { TabPane } = StyledTabs;

interface CustomTabsProps extends Omit<TabsProps, "type" | "size"> {
    type?: "primary" | "secondary" | "thin";
    size?: "xs" | "md" | "lg";
    className?: string;
    children?: React.ReactNode;
}

// ? Types of tabs: primary, secondary, thin
// ? Sizes of tabs: xs, md, lg
function CustomTabs({ type = "primary", size = "md", className = "", ...props }: CustomTabsProps) {
    return <StyledTabs className={`${className} ${size} ${type}`} {...props} />;
}

CustomTabs.TabPane = TabPane;
export default CustomTabs;
