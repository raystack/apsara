import styled from "styled-components";

export const Viewer = styled.pre`
    height: fit-content;
    max-height: 100%;
    font-size: ${({ theme }) => theme?.fontSizes[0]};
    line-height: 1.5;
    background: ${({ theme }) => theme?.codeblock?.bg};
    color: ${({ theme }) => theme?.codeblock?.text};
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
`;

export const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme?.codeblock?.bg};
    word-break: break-all;
    overflow: auto;
    border-radius: 2px;
    position: relative;
`;

export const CopyBtn = styled.div`
    position: absolute;
    top: 16px;
    right: 24px;
`;
