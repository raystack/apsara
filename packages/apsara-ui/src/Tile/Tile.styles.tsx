import styled from "styled-components";

export const Container = styled.div<{ active: boolean }>`
    max-width: 275px;
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.black[1]};
    cursor: pointer;
    padding: 12px 16px 20px;
    min-height: 82px;
    box-sizing: border-box;
    background: ${({ active, theme }) => (active ? theme?.colors?.black[2] : theme?.colors?.black[0])};
    border-right: ${({ active, theme }) => (active ? `2px solid ${theme?.colors?.primary[5]}` : "none")};
`;

export const Title = styled.div`
    text-align: left;
    color: ${({ theme }) => theme?.colors?.black[10]};
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 14px;
    letter-spacing: 0.12px;
`;

export const Description = styled.div`
    font-size: 11px;
    color: ${({ theme }) => theme?.colors?.black[8]};
    text-align: left;
    line-height: 13px;
    letter-spacing: 0.11px;
`;
