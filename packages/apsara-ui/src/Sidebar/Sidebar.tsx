/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import { Menu } from "antd";
import CustomIcon, { CustomIconProps } from "../Icon/Icon";
import { StyledSider, LogoWrapper, Title, Footer, FooterWrapper } from "./Sidebar.styles";

interface RenderItem {
    key: string;
    url: string;
    linkText: string;
    iconProps: CustomIconProps;
    isSubMenu: boolean;
}

const renderMenuItemLink = (
    item: RenderItem,
    onItemClick: (item: RenderItem) => void,
    LinkRender: ({ children }: any) => ReactElement,
) => {
    const { key, url, linkText, iconProps, isSubMenu } = item;
    const styleDetails = { display: "flex", alignItems: "center", container: { flexDirection: "row" } };
    if (isSubMenu) {
        styleDetails["paddingLeft"] = "15%";
    }
    return (
        <Menu.Item key={key} title={linkText} onClick={() => onItemClick(item)}>
            <LinkRender to={url}>
                <div style={styleDetails}>
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
    <Footer>
        <FooterWrapper>
            <div style={{ display: "flex", minHeight: "40px", alignItems: "center" }}>
                <CustomIcon className={collapsed ? "" : "rotate"} name="chevronright" />
            </div>
            <span className="nav-text">Collapse</span>
        </FooterWrapper>
    </Footer>
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
        <StyledSider
            width={180}
            collapsedWidth={65}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={<SidebarFooter collapsed={collapsed} />}
            {...extraProps}
        >
            <LogoWrapper>
                {iconProps ? <CustomIcon {...iconProps} className="img__logo" /> : null}
                {icon ? <span className="img__logo">{icon}</span> : null}
                {logo ? <img src={logo} alt="" className="img__logo" /> : null}
                <Title>{name}</Title>
            </LogoWrapper>
            <Menu mode="inline" style={{ borderRight: 0 }} selectedKeys={[activePath]}>
                {navigationList.map((link) => renderMenuItemLink(link, onItemClick, linkRender))}
            </Menu>
            {children}
        </StyledSider>
    );
};

export default Sidebar;
