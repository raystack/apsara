import styled, { css } from "styled-components";

export const StyledTooltip = styled("span")<{
    placement:
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "rightTop"
        | "rightBottom"
        | "leftTop"
        | "leftBottom"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight";
    arrowSize: string;
}>`
    position: relative;
    padding: 0;
    margin: 0;
    width: max-content;

    & > * {
        vertical-align: middle;
    }

    &::before,
    &::after {
        --scale: 0;
        --tooltip-color: ${({ color }) => color};
        --arrow-size: ${({ arrowSize }) => arrowSize};
        --top-shift: ${({ placement }) =>
            placement === "rightTop" || placement === "leftTop" ? "min(50%, 20px)" : "50%"};
        --translate-y: ${({ placement }) =>
            placement === "rightBottom" || placement === "leftBottom" ? "50%" : "-50%"};
        --left-shift: ${({ placement }) => (placement === "topLeft" || placement === "bottomLeft" ? "0%" : "50%")};
        --translate-x: ${({ placement }) => (placement === "top" || placement === "bottom" ? "-50%" : "0%")};
        position: absolute;
        z-index: 2147483647;
        font-size: 11px;
        font-family: Roboto;
        font-weight: 200;
        transition: 0.1s transform;
    }

    ${({ placement }) =>
        placement === "top" || placement === "topLeft" || placement === "topRight"
            ? css`
                  &::before,
                  &::after {
                      top: -0.25rem;
                      ${placement !== "topRight" ? "left: var(--left-shift)" : "right: 0%"};
                      transform: translateX(var(--translate-x)) translateY(var(--translate-y, 0)) scale(var(--scale));
                      transform-origin: bottom
                          ${placement === "top" ? "center" : placement === "topLeft" ? "left" : "right"};
                  }
              `
            : placement === "bottom" || placement === "bottomLeft" || placement === "bottomRight"
            ? css`
                  &::before,
                  &::after {
                      bottom: -0.25rem;
                      ${placement !== "bottomRight" ? "left: var(--left-shift)" : "right: 0%"};
                      transform: translateX(var(--translate-x)) translateY(var(--translate-y, 0)) scale(var(--scale));
                      transform-origin: top
                          ${placement === "bottom" ? "center" : placement === "bottomLeft" ? "left" : "right"};
                  }
              `
            : placement === "right" || placement === "rightTop" || placement === "rightBottom"
            ? css`
                  &::before,
                  &::after {
                      ${placement !== "rightBottom" ? "top: var(--top-shift)" : "bottom: min(50%, 30px)"};
                      right: -0.25rem;
                      transform: translateY(var(--translate-y)) translateX(var(--translate-x, 0)) scale(var(--scale));
                      transform-origin: left center;
                  }
              `
            : placement === "left" || placement === "leftTop" || placement === "leftBottom"
            ? css`
                  &::before,
                  &::after {
                      ${placement !== "leftBottom" ? "top: var(--top-shift)" : "bottom: min(50%, 30px)"};
                      left: -0.25rem;
                      transform: translateY(var(--translate-y)) translateX(var(--translate-x, 0)) scale(var(--scale));
                      transform-origin: right center;
                  }
              `
            : null}

    &::before {
        ${({ placement }) =>
            placement === "top" || placement === "topLeft" || placement === "topRight"
                ? css`
                      --translate-y: calc(-100% - var(--arrow-size));
                  `
                : placement === "bottom" || placement === "bottomLeft" || placement === "bottomRight"
                ? css`
                      --translate-y: calc(100% + var(--arrow-size));
                  `
                : placement === "right" || placement === "rightTop" || placement === "rightBottom"
                ? css`
                      --translate-x: calc(100% + var(--arrow-size));
                  `
                : placement === "left" || placement === "leftTop" || placement === "leftBottom"
                ? css`
                      --translate-x: calc(-100% - var(--arrow-size));
                  `
                : null}
        content: attr(data-tooltip);
        color: white;
        padding: 4px 8px;
        width: max-content;
        border-radius: 2px;
        text-align: center;
        background-color: var(--tooltip-color);
    }

    &:hover::before,
    &:hover::after {
        --scale: 1;
    }

    &::after {
        content: "";
        border: var(--arrow-size) solid transparent;
        ${({ placement }) =>
            placement === "top" || placement === "topLeft" || placement === "topRight"
                ? css`
                      --translate-y: calc(-1 * var(--arrow-size));
                      ${placement === "topRight"
                          ? "--translate-x: -5px"
                          : placement === "topLeft"
                          ? "--translate-x: 5px"
                          : null};
                      transform-origin: top
                          ${placement === "top" ? "center" : placement === "topLeft" ? "left" : "right"};
                      border-top-color: var(--tooltip-color);
                  `
                : placement === "bottom" || placement === "bottomLeft" || placement === "bottomRight"
                ? css`
                      --translate-y: calc(1 * var(--arrow-size));
                      ${placement === "bottomRight"
                          ? "--translate-x: -5px"
                          : placement === "bottomLeft"
                          ? "--translate-x: 5px"
                          : null};
                      transform-origin: bottom
                          ${placement === "bottom" ? "center" : placement === "bottomLeft" ? "left" : "right"};
                      border-bottom-color: var(--tooltip-color);
                  `
                : placement === "right" || placement === "rightTop" || placement === "rightBottom"
                ? css`
                      --translate-x: calc(1 * var(--arrow-size));
                      transform-origin: right center;
                      border-right-color: var(--tooltip-color);
                  `
                : placement === "left" || placement === "leftTop" || placement === "leftBottom"
                ? css`
                      --translate-x: calc(-1 * var(--arrow-size));
                      transform-origin: left center;
                      border-left-color: var(--tooltip-color);
                  `
                : null}
    }
`;
