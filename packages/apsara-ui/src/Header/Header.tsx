// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { ReactChildren, useContext } from "react";
import { ThemeContext } from "styled-components";
import Lottie from "react-lottie";
import CustomIcon from "../Icon";
import Learn from "../Learn";
import Markdown from "../Markdown";
import learnAnimation from "./learn.json";
import {
    Wrapper,
    RightBar,
    Title,
    Avatar,
    AvatarImage,
    AvatarFallback,
    DropDownContent,
    DropDownContentInner,
    MenuListItem,
} from "./Header.styles";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const getMenuList = (menuList: any[], iconColor: string) => (
    <DropDownContentInner className="dropDownMenu">
        {menuList.map((menu: any) => (
            <DropdownMenuPrimitive.Item key={menu.name}>
                <MenuListItem
                    rel="noopener noreferrer"
                    href={menu.href ? menu.href : "#"}
                    onClick={menu.onClick ? menu.onClick : () => null}
                >
                    {menu.icon && (
                        <CustomIcon
                            name={menu.icon}
                            size={24}
                            styleOverride={{ color: iconColor, marginRight: "15px" }}
                        />
                    )}
                    {menu.name}
                </MenuListItem>
            </DropdownMenuPrimitive.Item>
        ))}
    </DropDownContentInner>
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
                    <DropdownMenuPrimitive.Root>
                        <DropdownMenuPrimitive.Trigger asChild={true}>
                            <Avatar>
                                <AvatarImage src="" alt="" />
                                <AvatarFallback>{username[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuPrimitive.Trigger>
                        <DropdownMenuPrimitive.Portal>
                            <DropDownContent sideOffset={22} align="end">
                                {menu}
                            </DropDownContent>
                        </DropdownMenuPrimitive.Portal>
                    </DropdownMenuPrimitive.Root>
                )}
                {learnProps && (
                    <React.Fragment>
                        <Avatar onClick={toggleLearnVisibility} $learn>
                            <AvatarImage src="" />
                            <AvatarFallback $learn>
                                {isLearnVisible ? (
                                    <CustomIcon name="learn" style={{ fontSize: "24px" }} />
                                ) : (
                                    <div onClick={toggleLearnVisibility}>
                                        <Lottie options={defaultOptions} height={30} width={30} isStopped={false} />
                                    </div>
                                )}
                            </AvatarFallback>
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
