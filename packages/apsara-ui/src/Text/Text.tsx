import React from "react";

import styled, { css } from "styled-components";

export const defaultSize = 14;
export const styleMap = {
    11: {
        fontSize: "11px",
        lineHeight: "13px",
        letterSpacing: "0.11px",
    },
    12: {
        fontSize: "12px",
        lineHeight: "14px",
        letterSpacing: "0.12px",
    },
    14: {
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "0.14px",
    },
    16: {
        fontSize: "16px",
        lineHeight: "19px",
        letterSpacing: "0.16px",
    },
    18: {
        fontSize: "18px",
        lineHeight: "21px",
        letterSpacing: "0.18px",
    },
    20: {
        fontSize: "20px",
        lineHeight: "24px",
        letterSpacing: "0.20px",
    },
    22: {
        fontSize: "22px",
        lineHeight: "25px",
        letterSpacing: "0.22px",
    },
    25: {
        fontSize: "25px",
        lineHeight: "29px",
        letterSpacing: "0.25px",
    },
    28: {
        fontSize: "28px",
        lineHeight: "33px",
        letterSpacing: "0.28px",
    },
    32: {
        fontSize: "32px",
        lineHeight: "38px",
        letterSpacing: "0.32px",
    },
    36: {
        fontSize: "36px",
        lineHeight: "42px",
        letterSpacing: "0.36px",
    },
    40: {
        fontSize: "40px",
        lineHeight: "47px",
        letterSpacing: "0.40px",
    },
    45: {
        fontSize: "45px",
        lineHeight: "53px",
        letterSpacing: "0.45px",
    },
    50: {
        fontSize: "50px",
        lineHeight: "58px",
        letterSpacing: "0.50px",
    },
    60: {
        fontSize: "60px",
        lineHeight: "71px",
        letterSpacing: "0.60px",
    },
};

type TextProps = {
    type?: "default" | "secondary" | "success" | "warning" | "danger";
    disabled?: boolean;
    mark?: boolean;
    code?: boolean;
    keyboard?: boolean;
    underline?: boolean;
    strike?: boolean;
    strong?: boolean;
    italic?: boolean;
    ellipsis?: boolean;
    size?: keyof typeof styleMap;
} & React.HTMLAttributes<HTMLParagraphElement>;

const colorMap = {
    default: "black",
    secondary: "rgba(0, 0, 0, 0.45)",
    success: "#52c41a",
    warning: "#faad14",
    danger: "#ff4d4f",
};

const StyledText = styled("span")<{
    type: "default" | "secondary" | "success" | "warning" | "danger";
    disabled: boolean;
    mark: boolean;
    code: boolean;
    keyboard: boolean;
    underline: boolean;
    strike: boolean;
    strong: boolean;
    italic: boolean;
    size: keyof typeof styleMap;
    ellipsis: boolean;
}>`
    vertical-align: middle;
    color: ${({ type }) => colorMap[type]};
    ${({ size }) => css`
        font-size: ${styleMap[size].fontSize};
        line-height: ${styleMap[size].lineHeight};
        letter-spacing: ${styleMap[size].letterSpacing};
    `}

    ${({ ellipsis }) =>
        ellipsis &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `}

    ${({ mark }) =>
        mark &&
        css`
            background-color: #ffe58f;
        `}

    ${({ code }) =>
        code &&
        css`
            margin: 0 0.2em;
            padding: 0.2em 0.4em 0.1em;
            font-size: 85%;
            background: rgba(150, 150, 150, 0.1);
            border: 1px solid rgba(100, 100, 100, 0.2);
            border-radius: 3px;
        `}

    ${({ keyboard }) =>
        keyboard &&
        css`
            margin: 0 0.2em;
            padding: 0.15em 0.4em 0.1em;
            font-size: 90%;
            background: rgba(150, 150, 150, 0.06);
            border: 1px solid rgba(100, 100, 100, 0.2);
            border-bottom-width: 2px;
            border-radius: 3px;
        `}

    ${({ underline }) =>
        underline &&
        css`
            text-decoration: underline;
            text-decoration-skip-ink: auto;
        `}

    ${({ strike }) =>
        strike &&
        css`
            text-decoration: line-through;
        `}

    ${({ strong }) =>
        strong &&
        css`
            font-weight: 600;
        `}

    ${({ italic }) =>
        italic &&
        css`
            font-style: italic;
        `}
`;

const Text = ({
    type = "default",
    disabled = false,
    mark = false,
    code = false,
    keyboard = false,
    underline = false,
    strike = false,
    strong = false,
    italic = false,
    size = defaultSize,
    ellipsis = false,
    ...props
}: TextProps) => {
    const { children, className, ...restProps } = props;
    return (
        <StyledText
            type={type}
            disabled={disabled}
            mark={mark}
            code={code}
            keyboard={keyboard}
            underline={underline}
            strike={strike}
            strong={strong}
            italic={italic}
            size={size}
            ellipsis={ellipsis}
            className={`${className} apsara-text`}
            {...restProps}
        >
            {children}
        </StyledText>
    );
};

export default Text;
