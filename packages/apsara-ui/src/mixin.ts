import { css } from "styled-components";

export const textStyles = (size = "12px", color = "rgba(0, 0, 0, 0.7)", ls = "0px", weight = "300") => css`
    font-size: ${size} !important;
    font-weight: ${weight};
    color: ${color} !important;
    letter-spacing: ${ls};
`;
