import styled, { css } from "styled-components";
import { Layout, Avatar as AntdAvatar, AvatarProps, Menu as AntdMenu } from "antd";
import { textStyles } from "../mixin";

const { Header } = Layout;

export const Wrapper = styled(Header)`
    display: flex;
    align-items: center;
    padding: 0 40px;
    background-color: ${({ theme }) => theme?.header?.menuBg};
    border-bottom: solid 1px ${({ theme }) => theme?.colors?.black[3]};
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

export const Avatar: React.FC<AvatarProps> = styled(AntdAvatar)<{ $learn?: boolean }>`
    background: ${({ $learn, theme }) => ($learn ? theme?.header?.learn : theme?.header?.title)};
    color: ${({ theme }) => theme?.header?.avatar};
    vertical-align: middle;
    text-transform: capitalize;
    cursor: pointer;

    ${({ $learn }) =>
        $learn &&
        css`
            margin-left: 16px;
            display: flex;
            align-items: center;
        `}

    .ant-avatar-string {
        display: flex;
    }
`;

export const Menu = styled(AntdMenu)`
    min-width: 140px;
    background-color: ${({ theme }) => theme?.header?.menuBg};

    .ant-dropdown-menu-item {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.header?.menuText)}

        &:hover {
            background-color: ${({ theme }) => theme?.header?.menuHover};
        }
    }

    .anticon {
        font-size: 16px;
        margin-right: 12px;
    }
`;

export const MenuLink = styled.a`
    display: flex;
    align-items: center;
`;
