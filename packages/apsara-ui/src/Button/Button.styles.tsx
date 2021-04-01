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

    &&:hover {
        background: transparent;
    }
`;
