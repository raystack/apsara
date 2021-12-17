import styled from "styled-components";
import { Layout } from "antd";
import { textStyles, ellipsis } from "../mixin";

const { Sider } = Layout;

export const StyledSider = styled(Sider)`
    background: ${({ theme }) => theme?.sidebar?.bg};
    text-transform: capitalize;
    min-height: 100vh;
    border-right: 1px solid ${({ theme }) => theme?.sidebar?.border};

    .ant-menu {
        background: transparent;

        .ant-menu-item {
            padding: 0 0 0 14px !important;
            margin: 8px 0 !important;
            height: 32px;
            display: inline-flex;
            border-left: 2px solid transparent;
            overflow: visible !important;
            width: 100%;
            a {
                align-items: center;
                height: inherit;
                display: inline-flex;
            }

            span.nav-text {
                ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.sidebar?.nav, "0.3px")}
                font-weight: bold;
                display: flex;
                align-items: center;
            }

            span.anticon {
                margin-right: 16px;
                color: ${({ theme }) => theme?.sidebar?.nav} !important;
            }
        }

        .ant-menu-item-selected {
            border-left: 2px solid ${({ theme }) => theme?.sidebar?.active};
            background-color: transparent;

            span.anticon,
            span.nav-text {
                color: ${({ theme }) => theme?.sidebar?.active} !important;
            }

            &:after {
                border-right: 0;
            }
        }
    }

    .ant-menu-inline-collapsed {
        width: 65px;

        .ant-menu-item {
            span.anticon {
                margin-right: 0;
            }
        }
    }

    .ant-layout-sider-trigger {
        position: absolute;
        background: transparent;
        z-index: 600;
    }

    &.ant-layout-sider-collapsed {
        .sidebar__wrapper--title,
        .sidebar__wrapper--footer .nav-text {
            display: none;
        }
    }
`;

export const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 17px 16px 35px;
    ${ellipsis}

    .img__logo {
        min-width: 32px;
        height: auto;
        margin-right: 16px;

        .anticon {
            color: ${({ theme }) => theme?.sidebar?.title} !important;
        }
    }
`;

export const Title = styled.span`
    ${({ theme }) => textStyles("19px", theme?.sidebar?.title, "0.6px")}
    font-weight: bold;
`;

export const Footer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const FooterWrapper = styled.div`
    padding: 0 16px !important;
    align-items: center;
    display: inline-flex;
    width: 100%;
    height: 100%;
    min-height: 48px;

    .anticon {
        margin-right: 16px;
        padding: 4px;
        transform: rotate(0);
        transition: transform 0.5s;
        color: ${({ theme }) => theme?.sidebar?.trigger} !important;

        &.rotate {
            transform: rotate(180deg);
        }
    }

    .nav-text {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.sidebar?.trigger, "0.3px")}
        ${ellipsis}
        font-weight: bold;
    }
`;
