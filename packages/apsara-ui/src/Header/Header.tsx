// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { ReactChildren } from "react";
import { Layout, Avatar, Menu, Dropdown } from "antd";
import Lottie from "react-lottie";
import CustomIcon from "../Icon";
import Learn from "../Learn";
import Markdown from "../Markdown";
import learnAnimation from "./learn.json";

import "./header.less";
const AntHeader = Layout.Header;

const getMenuList = (menuList: any[]) => (
    <Menu className="header--wrapper--dropdown">
        {menuList.map((menu: any) => (
            <Menu.Item key={menu.name}>
                <a
                    rel="noopener noreferrer"
                    href={menu.href ? menu.href : "#"}
                    onClick={menu.onClick ? menu.onClick : () => null}
                    className="header--wrapper--dropdown-item"
                >
                    {menu.icon && <CustomIcon name={menu.icon} size={24} styleOverride={{ color: "#4C4C4C" }} />}
                    {menu.name}
                </a>
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
    const { isLearnVisible = false, content, toggleLearnVisibility, style: learnStyle } = learnProps || {};
    const menu = getMenuList(menuList);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: learnAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <AntHeader style={style} className={`header--wrapper ${className}`}>
            <span className="header--wrapper--title">{title}</span>
            <div className="header--wrapper--right">
                {children}
                {menuList.length > 0 && (
                    <Dropdown placement="bottomRight" style={{ height: "100%" }} overlay={menu} trigger={["click"]}>
                        <span className="header--wrapper--holder">
                            <Avatar className="header--wrapper--avatar">{username[0]}</Avatar>
                        </span>
                    </Dropdown>
                )}
                {learnProps && (
                    <React.Fragment>
                        <Avatar onClick={toggleLearnVisibility} className="header--wrapper--avatar learn">
                            {isLearnVisible ? (
                                <CustomIcon name="learn" style={{ backgroundColor: "#e4e4e4", fontSize: "24px" }} />
                            ) : (
                                <div className="learn__anim" onClick={toggleLearnVisibility}>
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
            </div>
        </AntHeader>
    );
};

export default Header;
