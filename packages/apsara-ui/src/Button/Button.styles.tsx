import styled, { css } from "styled-components";

const defaultSize = "middle";
const styleMap = {
    small: {
        padding: "0px 7px",
        height: "24px",
        fontSize: "11px",
        lineHeight: "13px",
        letterSpacing: "0.11px",
    },
    middle: {
        padding: "4px 12px",
        height: "32px",
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "0.14px",
    },
    large: {
        padding: "9px 12px",
        height: "45px",
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

export const StyledButton = styled("span")<{
    type: "primary" | "ghost" | "dashed" | "link" | "text" | "default" | "barebone";
    size: string | "small" | "middle" | "large";
    block: boolean;
    shape: "circle" | "round";
}>`
    .apsara-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-shadow: none;
        border-radius: ${({ shape }) => (shape === "circle" ? "50%" : "2px")};
        cursor: pointer;
        outline: none;
        border: 1px solid #fff;
        transition: 0.3s;
        ${({ block }) => block && "width: 100%"};

        padding: ${({ size }) => styleMap[size]?.padding || styleMap[defaultSize].padding};
        height: ${({ size }) => styleMap[size]?.height || styleMap[defaultSize].height};
        font-size: ${({ size }) => styleMap[size]?.fontSize || styleMap[defaultSize].fontSize};
        line-height: ${({ size }) => styleMap[size]?.lineHeight || styleMap[defaultSize].lineHeight};
        letter-spacing: ${({ size }) => styleMap[size]?.letterSpacing || styleMap[defaultSize].letterSpacing};

        &:focus {
            box-shadow: 0px 0px 0px 1px rgb(166, 200, 242);
            animation: anim-shadow 0.5s forwards;
        }

        @keyframes anim-shadow {
            100% {
                box-shadow: 0px 0px 5px 5px rgba(168, 208, 250, 0);
            }
        }

        ${({ theme }) => colorStyles(theme?.colors?.black[9], "transparent", theme?.colors?.black[4])}
        &:hover,
        &:focus {
            ${({ theme }) => colorStyles(theme?.colors?.primary[5], "transparent", theme?.colors?.primary[5])}
        }
        &:active {
            ${({ theme }) => colorStyles(theme?.colors?.primary[6], "transparent", theme?.colors?.primary[6])}
        }

        &[disabled] {
            cursor: not-allowed;
            &,
            &:hover,
            &:focus,
            &:active {
                ${({ theme }) => colorStyles(theme?.colors?.black[6], "transparent", theme?.colors?.black[4])}
            }
        }

        ${({ type, theme }) =>
            type === "primary"
                ? css`
                      ${colorStyles(theme?.colors?.black[0], theme?.colors?.primary[4], theme?.colors?.primary[4])}
                      &:hover,
                      &:focus {
                          ${colorStyles(theme?.colors?.black[0], theme?.colors?.primary[5], theme?.colors?.primary[5])}
                      }

                      &:active {
                          ${colorStyles(theme?.colors?.black[0], theme?.colors?.primary[6], theme?.colors?.primary[6])}
                      }

                      &[disabled] {
                          &,
                          &:hover,
                          &:focus,
                          &:active {
                              ${colorStyles(theme?.colors?.black[0], theme?.colors?.black[6], theme?.colors?.black[6])}
                          }
                      }
                  `
                : type === "text"
                ? css`
                      ${colorStyles(theme?.colors?.primary[4], "transparent", "transparent")}
                      &:hover,
                      &:focus {
                          ${colorStyles(theme?.colors?.primary[5], "transparent", "transparent")}
                          animation: none;
                          box-shadow: none;
                      }
                      &:active {
                          ${colorStyles(theme?.colors?.primary[6], "transparent", "transparent")}
                      }

                      &[disabled] {
                          &,
                          &:hover,
                          &:focus,
                          &:active {
                              ${colorStyles(theme?.colors?.black[6], "transparent", "transparent")}
                          }
                      }
                  `
                : type === "barebone"
                ? css`
                      padding: 0px;
                      background: transparent;
                      border: 0;
                      box-shadow: none;
                      color: ${({ theme }) => theme?.colors?.primary[5]};
                      font-weight: bold;

                      &.apsara-btn[disabled],
                      > .apsara-btn[disabled] {
                          display: flex;
                          align-self: center;
                          align-items: center;
                          font-weight: bold;
                          border: none !important;
                          background: transparent !important;
                          color: ${({ theme }) => theme?.colors?.black[6]};

                          > .apsara_icon {
                              vertical-align: text-bottom;
                          }
                      }

                      span.apsara_icon {
                          margin: 0;
                      }
                  `
                : type === "link"
                ? css`
                      &:focus {
                          animation: none;
                          box-shadow: none;
                      }
                  `
                : type === "dashed"
                ? css`
                      border-style: dashed;
                  `
                : null}
    }
    a.disabled {
        pointer-events: none;
        cursor: not-allowed;
        border-color: #b3b3b3;
        background: #b3b3b3;
    }
`;
