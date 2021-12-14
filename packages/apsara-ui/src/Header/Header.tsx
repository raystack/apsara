// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { ReactChildren, useContext } from "react";
import { ThemeContext } from "styled-components";
import { Dropdown } from "antd";
import Lottie from "react-lottie";
import CustomIcon from "../Icon";
import Learn from "../Learn";
import Markdown from "../Markdown";
import learnAnimation from "./learn.json";
import { Wrapper, RightBar, Title, Holder, Avatar, Menu, MenuLink } from "./Header.styles";

const getMenuList = (menuList: any[], iconColor: string) => (
    <Menu>
        {menuList.map((menu: any) => (
            <Menu.Item key={menu.name}>
                <MenuLink
                    rel="noopener noreferrer"
                    href={menu.href ? menu.href : "#"}
                    onClick={menu.onClick ? menu.onClick : () => null}
                >
                    {menu.icon && <CustomIcon name={menu.icon} size={24} styleOverride={{ color: iconColor }} />}
                    {menu.name}
                </MenuLink>
            </Menu.Item>
        ))}
    </Menu>
);

interface HeaderProps {
    title?: string;
    menuList?: any[];
    children?: ReactChildren;
    className?: string;
    style?: any;
    username?: string;
    learnProps?:
        | {
              style: any;
              content: string;
              isLearnVisible: boolean;
              toggleLearnVisibility: () => void;
          }
        | any;
}
const Header = ({
    title,
    children,
    style,
    menuList = [],
    className = "",
    username = "admin",
    learnProps,
}: HeaderProps) => {
    const theme = useContext(ThemeContext);
    const { isLearnVisible = false, content, toggleLearnVisibility, style: learnStyle } = learnProps || {};
    const menu = getMenuList(menuList, theme?.header?.menuText);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: learnAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Wrapper style={style} className={className}>
            <Title>{title}</Title>
            <RightBar>
                {children}
                {menuList.length > 0 && (
                    <Dropdown placement="bottomRight" style={{ height: "100%" }} overlay={menu} trigger={["click"]}>
                        <Holder>
                            <Avatar>{username[0]}</Avatar>
                        </Holder>
                    </Dropdown>
                )}
                {learnProps && (
                    <React.Fragment>
                        <Avatar onClick={toggleLearnVisibility} $learn>
                            {isLearnVisible ? (
                                <CustomIcon name="learn" style={{ fontSize: "24px" }} />
                            ) : (
                                <div onClick={toggleLearnVisibility}>
                                    <Lottie options={defaultOptions} height={30} width={30} isStopped={false} />
                                </div>
                            )}
                        </Avatar>
                    </React.Fragment>
                )}
                {isLearnVisible && (
                    <Learn
                        style={learnStyle}
                        isVisible={isLearnVisible}
                        setVisibility={toggleLearnVisibility}
                        content={<Markdown data={content} />}
                    />
                )}
            </RightBar>
        </Wrapper>
    );
};

export default Header;
