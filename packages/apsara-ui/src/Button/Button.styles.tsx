import Button from "antd/lib/button";
import styled from "styled-components";
import Colors from "../Colors";

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

        &&.ant-btn-primary {
            &:hover {
                background-color: ${Colors.primary[500]};
                border-color: ${Colors.primary[500]};
            }
        }
    }

    &&.barebone {
        padding: 0px;
        background: transparent;
        border: 0;
        box-shadow: none;
        color: ${Colors.primary[500]};
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
            color: ${Colors.error[500]} !important;
        }

        &.btn-success {
            color: ${Colors.success[500]};
        }

        span.anticon {
            margin: 0;
        }
    }

    &&:hover {
        background: transparent;
    }

    &&.ant-btn > .anticon + span,
    .ant-btn > .anticon + span,
    span {
        display: flex;
    }
`;
