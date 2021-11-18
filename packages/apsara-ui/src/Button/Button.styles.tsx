import Button from "antd/lib/button";
import styled, { css } from "styled-components";

const defaultSize = "default";
const styleMap = {
    small: {
        fontSize: "11px",
        lineHeight: "13px",
        letterSpacing: "0.11px",
    },
    default: {
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "0.14px",
    },
    large: {
        fontSize: "16px",
        lineHeight: "19px",
        letterSpacing: "0.16px",
    },
};

const colorStyles = (color: string, background: string, border: string) => css`
    color: ${color};
    border-color: ${border};
    background: ${background};
`;

export const AntdButton: any = styled(Button).attrs((props: any) => ({
    size: props.size || defaultSize,
}))`
    && {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: ${(props) => styleMap[props.size]?.fontSize || styleMap[defaultSize].fontSize};
        line-height: ${(props) => styleMap[props.size]?.lineHeight || styleMap[defaultSize].lineHeight};
        letter-spacing: ${(props) => styleMap[props.size]?.letterSpacing || styleMap[defaultSize].letterSpacing};

        ${(props) => colorStyles(props?.theme?.colors?.black[9], "transparent", props?.theme?.colors?.black[4])}
        &:hover,
        &:focus {
            ${(props) => colorStyles(props?.theme?.colors?.primary[5], "transparent", props?.theme?.colors?.primary[5])}
        }
        &:active {
            ${(props) => colorStyles(props?.theme?.colors?.primary[6], "transparent", props?.theme?.colors?.primary[6])}
        }
    }

    &&.ant-btn-primary {
        ${(props) =>
            colorStyles(
                props?.theme?.colors?.black[0],
                props?.theme?.colors?.primary[4],
                props?.theme?.colors?.primary[4],
            )}
        &:hover,
        &:focus {
            ${(props) =>
                colorStyles(
                    props?.theme?.colors?.black[0],
                    props?.theme?.colors?.primary[5],
                    props?.theme?.colors?.primary[5],
                )}
        }
        &:active {
            ${(props) =>
                colorStyles(
                    props?.theme?.colors?.black[0],
                    props?.theme?.colors?.primary[6],
                    props?.theme?.colors?.primary[6],
                )}
        }
    }

    &&.barebone {
        padding: 0px;
        background: transparent;
        border: 0;
        box-shadow: none;
        color: ${({ theme }) => theme?.colors?.primary[5]};
        font-weight: bold;

        &.ant-btn[disabled],
        > .ant-btn[disabled] {
            height: inherit;
            display: flex;
            align-self: center;
            align-items: center;
            font-weight: bold;
            border: none !important;
            background: transparent !important;
            color: #bfbfbf;

            > .anticon {
                vertical-align: text-bottom;
            }
        }

        &.btn-error,
        &.btn-error > .anticon {
            color: ${({ theme }) => theme?.colors?.error[4]} !important;
        }

        &.btn-success {
            color: ${({ theme }) => theme?.colors?.success[4]};
        }

        span.anticon {
            margin: 0;
        }
    }

    &&.ant-btn > .anticon + span,
    .ant-btn > .anticon + span,
    span {
        display: flex;
    }
`;
