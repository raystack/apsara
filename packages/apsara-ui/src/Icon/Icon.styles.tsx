import styled, { css } from "styled-components";

export const IconWrapper = styled("span")<{ disabled: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    cursor: pointer;

    ${({ disabled }) =>
        disabled &&
        css`
            cursor: not-allowed;
            color: #797979 !important;
        `}
`;
