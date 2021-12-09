import styled, { css } from "styled-components";
import { textStyles } from "../mixin";

export const Wrapper = styled.div<{ secondary: boolean }>`
    display: flex;
    position: relative;

    &:first-child {
        flex: 1;
    }

    & > :not(:first-child) {
        margin-left: 12px;
    }

    .ant-input-affix-wrapper {
        width: auto;
        flex: 1;
    }

    .ant-input-affix-wrapper .ant-input:not(:last-child) {
        padding-left: 30px;
    }

    .searchfilter,
    .search {
        position: absolute;
        transform: translateY(50%);
        z-index: 2;
    }

    .ant-input {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[9])}
        background-color: transparent;
    }

    .placeholder {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[7])}
    }

    :-moz-placeholder {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[7])}
    }

    ::-moz-placeholder {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[7])}
    }

    :-ms-input-placeholder {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[7])}
    }

    ::-webkit-input-placeholder {
        ${({ theme }) => textStyles("10px", theme?.colors?.black[7])}
    }

    ${({ secondary }) =>
        secondary &&
        css`
            .ant-input {
                border: none !important;
                background: ${({ theme }) => theme?.colors?.black[2]};
                transition: border-color 0.5s ease;
            }
        `}

    .RightSideBar & {
        & > :last-child {
            margin-right: 40px !important;
        }
    }
`;
