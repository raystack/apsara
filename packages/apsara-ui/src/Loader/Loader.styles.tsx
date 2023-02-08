import styled, { keyframes } from "styled-components";

const loaderRotate = keyframes`
    100% { transform: rotate(360deg); }
`;
const apsaraLoaderMove = keyframes`
    100% { opacity: 1;}
`;

export const LoaderWrapper = styled.div`
    .apsara-loader {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        position: absolute;
        display: none;
        color: #1890ff;
        text-align: center;
        vertical-align: middle;
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);

        &-sm .apsara-loader-dot {
            font-size: 14px !important;

            i {
                width: 6px;
                height: 6px;
            }
        }

        &-lg .apsara-loader-dot {
            font-size: 32px !important;

            i {
                width: 14px;
                height: 14px;
            }
        }

        &-spinning {
            position: static;
            display: inline-block;
            opacity: 1;
        }

        .apsara-loader-dot-spin {
            transform: rotate(0);
            animation: ${loaderRotate} 1.2s infinite linear;
        }

        .apsara-loader-dot {
            position: relative;
            display: inline-block;
            font-size: 20px;
            width: 1em;
            height: 1em;
        }

        .apsara-loader-dot-item {
            position: absolute;
            display: block;
            width: 9px;
            height: 9px;
            background-color: #1890ff;
            border-radius: 100%;
            transform: scale(0.75);
            transform-origin: 50% 50%;
            opacity: 0.3;
            animation: ${apsaraLoaderMove} 1s infinite linear alternate;

            &:nth-child(1) {
                top: 0;
                left: 0;
            }
            &:nth-child(2) {
                top: 0;
                right: 0;
                animation-delay: 0.4s;
            }
            &:nth-child(3) {
                right: 0;
                bottom: 0;
                animation-delay: 0.8s;
            }
            &:nth-child(4) {
                bottom: 0;
                left: 0;
                animation-delay: 1.2s;
            }
        }
    }
`;
