import styled from "styled-components";
import { Result } from "antd";

export const StyledResult = styled(Result)`
    background-color: ${({ theme }) => theme?.states?.bg};
    .ant-result-icon {
        margin-bottom: 39px;
    }
    .ant-result-title {
        color: ${({ theme }) => theme?.states?.text};
        font-size: ${({ theme }) => theme?.fontSizes[3]};
        font-weight: bold;
        line-height: 1.4;
    }
    .ant-result-subtitle {
        color: ${({ theme }) => theme?.states?.text};
        line-height: 1.4;
        margin-top: 12px;
        overflow: auto;
        max-height: calc(100vh - 500px);
        max-width: 80vw;
    }
`;
