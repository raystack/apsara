import styled, { css } from "styled-components";
import { textStyles, ellipsis } from "../mixin";

export const StyledSider = styled("div")<{ width: number; collapsedWidth: number; collapsed: boolean }>`
    background: ${({ theme }) => theme?.sidebar?.bg};
    text-transform: capitalize;
    min-height: 100vh;
    width: ${({ width }) => `${width}px`};
    display: flex !important;
    flex-direction: column !important;
    border-right: 1px solid ${({ theme }) => theme?.sidebar?.border};
    transition: width 0.4s;

    ${({ collapsed, collapsedWidth }) =>
        collapsed &&
        css`
            width: ${collapsedWidth}px;
            & .apsara-nav-title {
                opacity: 0;
            }
            & .apsara-nav-text {
                opacity: 0;
            }
            & .apsara_icon {
                margin-right: 0;
            }

            & .apsara-sider-title {
                width: 0;
            }
        `}
`;

export const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 17px 16px 35px;
    ${ellipsis}

    .img__logo {
        width: 32px;
        height: auto;
        margin-right: 16px;

        .apsara_icon {
            color: ${({ theme }) => theme?.sidebar?.title} !important;
        }
    }
`;

export const SidebarTitle = styled.span`
    ${({ theme }) => textStyles("19px", theme?.sidebar?.title, "0.6px")}
    font-weight: bold;
    transition: opacity 0.4s;
`;

export const Footer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: auto;
    cursor: pointer;
`;

export const FooterWrapper = styled.div`
    padding: 0 16px !important;
    align-items: center;
    display: inline-flex;
    width: 100%;
    height: 100%;
    min-height: 48px;

    .apsara_icon {
        margin-right: 16px;
        padding: 4px;
        transform: rotate(0);
        transition: transform 0.5s;
        color: ${({ theme }) => theme?.sidebar?.trigger} !important;

        & .rotate {
            transform: rotate(180deg);
        }
    }

    .apsara-nav-text {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.sidebar?.trigger, "0.3px")}
        ${ellipsis}
        font-weight: bold;
        transition: opacity 0.4s;
    }
`;

export const StyledSiderMenu = styled("div")`
    display: flex;
    flex-direction: column;
`;

export const NavigationItemWrapper = styled("span")<{ selected: boolean }>`
    cursor: pointer;
    padding: 0 0 0 14px;
    margin: 8px 0;
    height: 32px;
    display: inline-flex;
    border-left: 2px solid transparent;
    overflow: visible;
    width: 100%;

    &:active {
        background: transparent;
    }

    & .apsara-nav-text {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.sidebar?.nav, "0.3px")}
        font-weight: bold;
        display: flex;
        align-items: center;
        transition: opacity 0.4s;
    }

    & .apsara_icon {
        margin-right: 16px;
        color: ${({ theme }) => theme?.sidebar?.nav} !important;
        transition: margin 0.4s;
    }

    ${({ selected }) =>
        selected &&
        css`
            background-color: transparent;
            border-left: 2px solid ${({ theme }) => theme?.sidebar?.active};
            & .apsara_icon,
            & .apsara-nav-text {
                color: ${({ theme }) => theme?.sidebar?.active} !important;
            }
        `}
`;
