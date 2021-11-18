import styled from "styled-components";
import Text from "../Text";

export const LearnWindow = styled.div<{ isVisible: boolean }>`
    position: absolute;
    z-index: 1050;
    right: 0;
    top: 0;
    width: 310px;
    box-shadow: -1px 0px 4px 0px rgba(0, 0, 0, 0.1);
    background: ${({ theme }) => theme?.learn?.bg};
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    display: ${({ isVisible }) => (isVisible ? "block" : "none")};
`;

export const LearnHead = styled.div`
    display: flex;
    width: 100%;
    height: 39px;
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.black[4]};
    padding: 1%;
    align-items: center;
    padding: 0 16px;
`;

export const LearnBody = styled.div`
    display: flex;
    flex-wrap: wrap;
    font-size: ${({ theme }) => theme?.fontSizes[1]};
`;

export const LearnTitle = styled(Text)`
    color: ${({ theme }) => theme?.learn?.title};
`;

export const LearnCloseBtn = styled.div`
    flex: auto;
    text-align: end;
    font-size: ${({ theme }) => theme?.fontSizes[2]};
    position: relative;
    color: ${({ theme }) => theme?.learn?.close};

    > span {
        font-size: 30px;
        cursor: pointer;
    }
`;
