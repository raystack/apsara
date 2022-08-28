/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import CustomIcon, { CustomIconProps } from "../Icon/Icon";
import {
    StyledSider,
    LogoWrapper,
    SidebarTitle,
    Footer,
    FooterWrapper,
    StyledSiderMenu,
    NavigationItemWrapper,
} from "./Sidebar.styles";
import Tooltip from "../Tooltip";

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
    selected: string,
    collapsed: boolean,
) => {
    const { key, url, linkText, iconProps, isSubMenu } = item;
    const styleDetails = { display: "flex", alignItems: "center", container: { flexDirection: "row" } };
    if (isSubMenu) {
        styleDetails["paddingLeft"] = "15%";
    }

    const icon = <CustomIcon {...iconProps} />;
    return (
        <NavigationItemWrapper selected={selected === item.key} key={key} onClick={() => onItemClick(item)}>
            <LinkRender to={url}>
                <div style={styleDetails}>
                    {collapsed ? (
                        <Tooltip title={item.linkText} placement="right">
                            {icon}
                        </Tooltip>
                    ) : (
                        icon
                    )}
                    <span className="apsara-nav-text">{linkText}</span>
                </div>
            </LinkRender>
        </NavigationItemWrapper>
    );
};

type SiderMenuProps = {
    selectedLink: string;
    navigationList: RenderItem[];
    onItemClick: (item: RenderItem) => void;
    linkRender: ({ children }: any) => ReactElement;
    collapsed: boolean;
};

const SiderMenu = ({ selectedLink, navigationList, onItemClick, linkRender, collapsed }: SiderMenuProps) => {
    if (!selectedLink) selectedLink = navigationList[0].key;
    const [link, setLink] = useState(selectedLink);
    useEffect(() => {
        setLink(selectedLink);
    }, [selectedLink]);

    const onChange = (item: RenderItem) => {
        setLink(item.key);
        onItemClick(item);
    };

    return (
        <StyledSiderMenu>
            {navigationList &&
                navigationList.map((item) => renderMenuItemLink(item, onChange, linkRender, link, collapsed))}
        </StyledSiderMenu>
    );
};

interface collapsedProps {
    collapsed: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SidebarFooter = ({ collapsed, onClick }: collapsedProps) => (
    <Footer onClick={onClick} className="apsara-sidebar-footer">
        <FooterWrapper>
            <div style={{ display: "flex", minHeight: "40px", alignItems: "center" }}>
                <CustomIcon className={collapsed ? "" : "rotate"} name="chevronright" />
            </div>
            <span className="apsara-nav-text">Collapse</span>
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
    width?: number;
    collapsedWidth?: number;
}

const rightSidebarState = localStorage.getItem("NAV_SIDEBAR_STATE") === "true";
const Sidebar = ({
    headerProps = {},
    activePath = "",
    navigationList = [],
    onItemClick = () => null,
    linkRender = ({ children }) => <React.Fragment>{children}</React.Fragment>,
    children,
    width = 180,
    collapsedWidth = 65,
}: SidebarProps) => {
    const { name = "", logo = "", iconProps, icon = null } = headerProps;
    const [collapsed, setCollapsed] = useState(rightSidebarState || false);

    useEffect(() => {
        localStorage.setItem("NAV_SIDEBAR_STATE", collapsed.toString());
    }, [collapsed]);

    return (
        <StyledSider width={width} collapsedWidth={collapsedWidth} collapsed={collapsed}>
            <LogoWrapper>
                {iconProps ? <CustomIcon {...iconProps} className="img__logo" /> : null}
                {icon ? <span className="img__logo">{icon}</span> : null}
                {logo ? <img src={logo} alt="" className="img__logo" /> : null}
                <SidebarTitle className="apsara-nav-title">{name}</SidebarTitle>
            </LogoWrapper>
            <SiderMenu
                selectedLink={activePath}
                navigationList={navigationList}
                onItemClick={onItemClick}
                linkRender={linkRender}
                collapsed={collapsed}
            />
            {children}
            <SidebarFooter
                onClick={() => {
                    setCollapsed(!collapsed);
                }}
                collapsed={collapsed}
            />
        </StyledSider>
    );
};

export default Sidebar;
