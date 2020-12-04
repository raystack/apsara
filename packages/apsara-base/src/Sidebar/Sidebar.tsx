/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import { Layout, Menu } from "antd";
import CustomIcon from "../Icon";
import "./Sidebar.less";

const { Sider } = Layout;

const renderMenuItemLink = (
    { key, url, linkText, icon }: any,
    onItemClick: (url: string) => void,
    LinkRender: ({ children }: any) => ReactElement,
) => {
    return (
        <Menu.Item key={key} onClick={() => onItemClick(url)}>
            <LinkRender to={url}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <CustomIcon styleOverride={{ color: "#4D4D4D" }} name={icon} />
                    <span className="nav-text">{linkText}</span>
                </div>
            </LinkRender>
        </Menu.Item>
    );
};

interface collapsedProps {
    collapsed: boolean;
}
const SidebarFooter = ({ collapsed }: collapsedProps) => (
    <div className="footer__sidebar">
        <div className="sidebar__wrapper--footer">
            <div style={{ display: "flex", minHeight: "40px" }}>
                <CustomIcon
                    className={collapsed ? "" : "rotate"}
                    styleOverride={{ color: "#999999" }}
                    name="chevronright"
                />
            </div>
            <span className="nav-text">Collapse</span>
        </div>
    </div>
);

interface SidebarProps {
    headerProps: {
        name?: string;
        logo?: string;
    };
    activePath: string;
    navigationList: any[];
    onItemClick?: (url: string) => void;
    children?: ReactNode;
    linkRender?: ({ children }: any) => ReactElement;
}

const rightSidebarState = localStorage.getItem("NAV_SIDEBAR_STATE") === "true";
const Sidebar = ({
    headerProps: { name = "", logo = "" },
    activePath,
    navigationList,
    onItemClick = () => null,
    linkRender = ({ children }) => <React.Fragment>{children}</React.Fragment>,
    children,
    ...extraProps
}: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(rightSidebarState || false);

    useEffect(() => {
        localStorage.setItem("NAV_SIDEBAR_STATE", collapsed.toString());
    }, [collapsed]);

    const onCollapse = (val: boolean) => {
        setCollapsed(val);
    };

    return (
        <Sider
            width={180}
            collapsedWidth={65}
            className="sidebar__wrapper"
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={<SidebarFooter collapsed={collapsed} />}
            {...extraProps}
        >
            <div className="sidebar__wrapper--logo">
                <img src={logo} alt="" className="img__logo" />
                <span className="sidebar__wrapper--title">{name}</span>
            </div>
            <Menu mode="inline" style={{ borderRight: 0 }} selectedKeys={[activePath]}>
                {navigationList.map((link) => renderMenuItemLink(link, onItemClick, linkRender))}
            </Menu>
            {children}
        </Sider>
    );
};

export default Sidebar;