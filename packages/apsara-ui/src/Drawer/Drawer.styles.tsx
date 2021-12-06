import styled from "styled-components";

export const Overlay = styled.div`
    animation: opacity 200ms ease-out;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: ${({ theme }) => theme?.colors?.black[6]};
`;

export const Body = styled.div<{ position: "left" | "right" }>`
    background: ${({ theme }) => theme?.drawer?.bg};
    color: ${({ theme }) => theme?.drawer?.text};
    border-radius: ${({ position }) => (position === "left" ? "0 5px 5px 0" : "5px 0 0 5px")};
    position: absolute;
    top: 0;
    left: ${({ position }) => (position === "left" ? "0" : "50%")};
    right: ${({ position }) => (position === "left" ? "50%" : "0")};
    bottom: 0;

    .skeleton-icon.cross {
        position: absolute;
        top: 20px;
        right: 32px;
    }
`;
