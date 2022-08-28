import styled, { css } from "styled-components";

const StyledWrapper = styled("div")<{
    size?: "small" | "middle" | "large";
    disabled?: boolean;
}>`
    display: flex;
    border: 1px solid ${({ theme }) => theme?.input?.border};
    background-color: ${({ theme }) => theme?.input?.bg};
    transition: all 0.4s;
    width: 100%;
    font-weight: 400;
    line-height: 1.5715;
    align-items: center;
    border-radius: 2px;
    box-sizing: border-box;
    &:hover {
        border-color: ${({ theme }) => theme?.input?.hover};
    }

    &:focus-within {
        border: 1px solid ${({ theme }) => theme?.input?.hover};
    }

    ${({ size }) => {
        return size === "small"
            ? css`
                  padding: 0px 5px 0px 11px;
                  font-size: 14px;
              `
            : size === "middle"
            ? css`
                  padding: 4px 5px 4px 11px;
                  font-size: 14px;
              `
            : css`
                  padding: 6.5px 5px 6.5px 11px;
                  font-size: 16px;
              `;
    }}

    ${({ disabled, theme }) =>
        disabled &&
        css`
            color: ${theme?.input?.placeholder};
            background-color: ${theme?.input?.disabled};
            border-color: ${theme?.input?.border};
            cursor: not-allowed;
            :hover {
                border-color: ${theme?.input?.border};
            }
        `}

    .input_close_icon_wrapper {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .input_close_icon {
        z-index: 2;
        cursor: pointer;
        background-color: #a9a9a9;
        font-size: 10px;
        font-family: Roboto;
        color: rgba(0, 0, 0, 0.25);
        display: flex;
        width: 12.5px;
        height: 12px;
        color: white;
        border-radius: 100%;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-left: 5px;
        margin-right: 7px;

        &:hover {
            background-color: #898989;
        }
    }

    .input_suffix_prefix {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 10px;
    }

    .input_suffix {
        padding-left: 10px;
    }

    .input_close_icon_wrapper .input_main {
        box-sizing: border-box;
        color: ${({ theme }) => theme?.input?.text};
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;

        &[disabled] {
            cursor: not-allowed;
            color: ${({ theme }) => theme?.input?.placeholder};
        }

        &::placeholder {
            color: ${({ theme }) => theme?.input?.placeholder};
            font-style: italic;
            position: relative;
        }
    }
`;

export const TextAreaWrapper = styled("div")<{ size?: "small" | "middle" | "large" }>`
    .input_textarea_main {
        width: 100%;
        border: 1px solid ${({ theme }) => theme?.input?.border};
        border-radius: 2px;
        outline: none;
        font-weight: 400;
        line-height: 1.5715;
        transition: all 0.4s;

        ${({ size }) => {
            return size === "small"
                ? css`
                      padding: 0px 5px 0px 11px;
                      font-size: 14px;
                  `
                : size === "middle"
                ? css`
                      padding: 4px 5px 4px 11px;
                      font-size: 14px;
                  `
                : css`
                      padding: 6.5px 5px 6.5px 11px;
                      font-size: 16px;
                  `;
        }}

        &:hover {
            border-color: ${({ theme }) => theme?.input?.hover};
        }

        &:focus {
            border-color: ${({ theme }) => theme?.input?.hover};
        }

        &::placeholder {
            color: ${({ theme }) => theme?.input?.placeholder};
        }
    }
`;

export default StyledWrapper;
