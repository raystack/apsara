import styled, { keyframes } from "styled-components";

const zoomBadgeIn = keyframes`
0% {
    transform: scale(0) translate(50%, -50%);
    opacity: 0;
}
100% {
    transform: scale(1) translate(50%, -50%);
}
`;
const zoomBadgeOut = keyframes`
0% {
    transform: scale(1) translate(50%, -50%);
}
100% {
    transform: scale(0) translate(50%, -50%);
    opacity: 0;
}
`;

export const BadgeWrapper = styled.span`
    .badge-dot-pos {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0%;
    }
    .badge-dot {
        z-index: auto;
        width: 6px;
        min-width: 6px;
        height: 6px;
        background: #1e7ae8;
        border-radius: 100%;
        box-shadow: 0 0 0 1px #fff;
    }
    .zoom-enter {
        animation: ${zoomBadgeIn} 0.3s cubic-bezier(0.12, 0.4, 0.29, 1.46);
        animation-fill-mode: both;
    }
    .zoom-leave {
        animation: ${zoomBadgeOut} 0.3s cubic-bezier(0.71, -0.46, 0.88, 0.6);
        animation-fill-mode: both;
    }
`;
