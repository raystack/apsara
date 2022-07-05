import styled from "styled-components";
// import { textStyles } from "../mixin";

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

export const InfoBox = styled.div`
    background: white;
    border-radius: 5px;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
`;

export const Title = styled.a`
    font-size: 16px;
    font-weight: bold;
    color: #4b4b4b;
    float: left;
    padding-top: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 50vh;
`;

export const CloseDiv = styled.div`
    float: right;
`;

export const HeadingWrapper = styled.div`
    display: inline-block;
    width: 100%;
`;
