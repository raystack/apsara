import styled from "styled-components";
import { AntdButton } from "../Button/Button.styles";
import { textStyles } from "../mixin";

export const Overlay = styled.div`
    animation: opacity 200ms ease-out;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
`;

export const ConfirmBox = styled.div`
    background: ${({ theme }) => theme?.confirmModal?.bg};
    ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.confirmModal?.text, "0.12px")}
    border-radius: 5px;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
`;

export const Title = styled.h3`
    ${({ theme }) => textStyles(theme?.fontSizes[2], theme?.confirmModal?.text, "0.12px", "bold")}
    margin-bottom: 8px;
`;

export const ActionWrapper = styled.div`
    margin-top: 24px;

    ${AntdButton} {
        font-size: 12px;
        letter-spacing: 0.12px;
        line-height: 16px;
        font-weight: bold;
        min-width: 120px;
    }

    ${AntdButton}+${AntdButton} {
        margin-left: 16px;
    }
`;
