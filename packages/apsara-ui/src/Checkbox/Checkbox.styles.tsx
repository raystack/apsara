import styled, { css } from "styled-components";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export const StyledCheckbox = styled(CheckboxPrimitive.Root)`
    all: unset;
    background-color: white;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #c9c9c9;
    transition: all 0.4s;
    &:hover {
        border-color: ${({ theme }) => theme?.checkbox?.border};
    }
    &:focus {
        border-color: ${({ theme }) => theme?.checkbox?.border};
        box-shadow: 0 0 0 2px ${({ theme }) => theme?.checkbox?.shadow};
    }

    &[data-state="checked"] {
        border-color: ${({ theme }) => theme?.checkbox?.border};
        background-color: ${({ theme }) => theme?.checkbox?.bg};
    }
`;

export const CheckboxWrapper = styled("div")`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const CheckboxGroupWrapper = styled("div")<{ orientation?: "horizontal" | "vertical" }>`
    display: flex;
    flex-wrap: wrap;
    ${({ orientation }) => {
        return orientation === "vertical"
            ? css`
                  flex-direction: column;
                  justify-content: center;
                  align-items: start;
              `
            : css`
                  flex-direction: row;
                  align-items: center;
              `;
    }};

    gap: 15px;

    .checkbox_label_wrapper {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 10px;
    }
`;

export const StyledIndicator = styled(CheckboxPrimitive.Indicator)`
    color: ${({ theme }) => theme?.checkbox?.indicator};
    display: flex;
    align-items: center;
    justify-content: center;
`;
