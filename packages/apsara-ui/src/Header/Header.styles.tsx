import styled, { css } from "styled-components";
import { textStyles } from "../mixin";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const StyledAvatar = styled(AvatarPrimitive.Root)<{ $learn?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    user-select: none;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    ${({ $learn }) =>
        $learn &&
        css`
            margin-left: 16px;
            display: flex;
            align-items: center;
        `}
`;

const StyledImage = styled(AvatarPrimitive.Image)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
`;

const StyledFallback = styled(AvatarPrimitive.Fallback)<{ $learn?: boolean }>`
    background: ${({ $learn, theme }) => ($learn ? theme?.header?.learn : theme?.header?.title)};
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 15px;
    line-height: 1;
    font-weight: 500;
    text-transform: capitalize;

    ${({ $learn }) =>
        $learn &&
        css`
            div {
                scale: 0.9;
            }
        `}
`;

export const Avatar = StyledAvatar;
export const AvatarImage = StyledImage;
export const AvatarFallback = StyledFallback;

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 40px;
    background-color: ${({ theme }) => theme?.header?.menuBg};
    border-bottom: solid 1px ${({ theme }) => theme?.colors?.black[3]};
    line-height: 64px;
`;

export const RightBar = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
`;

export const Title = styled.span`
    ${({ theme }) => textStyles(theme?.fontSizes[3], theme?.header?.title, "0.5px")}
    text-transform: capitalize;
`;

export const Holder = styled.span`
    display: inline-block;
    margin-left: 8px;
`;

export const MenuLink = styled.a`
    display: flex;
    align-items: center;
`;

export const DropDownContent = styled(DropdownMenuPrimitive.Content)`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum";
    top: 10px;
    left: -9999px;
    z-index: 1050;
    display: block;
`;

export const DropDownContentInner = styled.div`
    position: relative;
    margin: 0;
    padding: 4px 0;
    text-align: left;
    list-style-type: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    min-width: 140px;
`;

export const MenuListItem = styled.div`
    all: unset;
    line-height: 1.5px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    height: 25px;
    padding: 5px 12px;
    position: relative;
    user-select: none;
    &:hover {
        background-color: ${({ theme }) => theme?.header?.menuHover};
    }
    font-size: 12px;
    font-weight: 300;
    color: rgb(75, 75, 75);
    letter-spacing: 0px;
`;
