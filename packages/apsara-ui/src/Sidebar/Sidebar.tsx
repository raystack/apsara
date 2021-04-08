/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import { Layout, Menu } from "antd";
import CustomIcon, { CustomIconProps } from "../Icon/Icon";
import "./Sidebar.less";

const { Sider } = Layout;

interface RenderItem {
    key: string;
    url: string;
    linkText: string;
    iconProps: CustomIconProps;
}

const renderMenuItemLink = (
    item: RenderItem,
    onItemClick: (item: RenderItem) => void,
    LinkRender: ({ children }: any) => ReactElement,
) => {
    const { key, url, linkText, iconProps } = item;
    return (
        <Menu.Item key={key} onClick={() => onItemClick(item)}>
            <LinkRender to={url}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <CustomIcon {...iconProps} />
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
            <div style={{ display: "flex", minHeight: "40px", alignItems: "center" }}>
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

interface HeaderProps {
    name?: string;
    logo?: never;
    icon?: never;
    iconProps?: never;
}

type OnlyLogo = Omit<HeaderProps, "logo"> & { logo?: string };
type OnlyIcon = Omit<HeaderProps, "icon"> & { icon?: React.ReactNode };
type OnlyIconProps = Omit<HeaderProps, "iconProps"> & { iconProps?: CustomIconProps };

interface SidebarProps {
    headerProps?: OnlyIcon | OnlyIconProps | OnlyLogo;
    activePath?: string;
    navigationList?: RenderItem[];
    onItemClick?: (item: RenderItem) => void;
    children?: ReactNode;
    linkRender?: ({ children }: any) => ReactElement;
}

const rightSidebarState = localStorage.getItem("NAV_SIDEBAR_STATE") === "true";
const Sidebar = ({
    headerProps = {},
    activePath = "",
    navigationList = [],
    onItemClick = () => null,
    linkRender = ({ children }) => <React.Fragment>{children}</React.Fragment>,
    children,
    ...extraProps
}: SidebarProps) => {
    const { name = "", logo = "", iconProps, icon = null } = headerProps;
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
                {iconProps ? <CustomIcon {...iconProps} className="img__logo" /> : null}
                {icon ? <span className="img__logo">{icon}</span> : null}
                {logo ? <img src={logo} alt="" className="img__logo" /> : null}
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
