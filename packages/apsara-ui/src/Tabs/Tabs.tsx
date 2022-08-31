import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs.styles";
import { TabsProps } from "@radix-ui/react-tabs";
// const { TabPane } = StyledTabs;

type TabContentProps = {
    value: string;
    content?: ReactNode;
    title?: string;
    disabled?: boolean;
};

type CustomTabsProps = {
    type?: "primary" | "secondary" | "thin";
    size?: "xs" | "md" | "lg";
    tabContent?: TabContentProps[];
    className?: string;
    children?: React.ReactNode;
    defaultValue?: string;
    tabExtraContentLeft?: ReactNode;
    tabExtraContentRight?: ReactNode;
} & TabsProps;

// ? Types of tabs: primary, secondary, thin
// ? Sizes of tabs: xs, md, lg
function CustomTabs({
    type = "primary",
    size = "md",
    className = "",
    tabContent,
    defaultValue,
    tabExtraContentLeft,
    tabExtraContentRight,
    children,
    ...props
}: CustomTabsProps) {
    if (!defaultValue && tabContent && tabContent.length > 0) defaultValue = tabContent[0].value;
    return (
        <Tabs className={className} defaultValue={defaultValue} {...props}>
            <TabsList size={size} aria-label="Manage your account">
                {tabExtraContentLeft && <span className="left">{tabExtraContentLeft}</span>}
                {tabContent &&
                    tabContent.map((content) => (
                        <TabsTrigger disabled={content.disabled} typ={type} key={content.value} value={content.value}>
                            {content.title}
                        </TabsTrigger>
                    ))}
                {tabExtraContentRight && <span className="right">{tabExtraContentRight}</span>}
            </TabsList>

            {tabContent &&
                tabContent.map((content) => (
                    <TabsContent key={content.value} value={content.value}>
                        {content.content}
                    </TabsContent>
                ))}
            {!tabContent && children}
        </Tabs>
    );
    // return <StyledTabs className={`${className} ${size} ${type}`} {...props} />;
}

// CustomTabs.TabPane = TabPane;
CustomTabs.List = TabsList;
CustomTabs.Trigger = TabsTrigger;
CustomTabs.Content = TabsContent;
export default CustomTabs;
