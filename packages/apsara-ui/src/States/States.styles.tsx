import styled from "styled-components";
import Result from "./Result";

export const StyledResult = styled(Result)`
    background-color: ${({ theme }) => theme?.states?.bg};
    .apsara-result-success .anticon {
        color: #52c41a;
    }
    .apsara-result-error .anticon {
        color: #ff4d4f;
    }
    .apsara-result-info .anticon {
        color: #1890ff;
    }
    .apsara-result-warning.anticon {
        color: #faad14;
    }

    .apsara-result-icon {
        margin-bottom: 39px;
        text-align: center;
        .anticon {
            font-size: 72px;
        }
    }
    .apsaraicon {
        display: inline-block;
        font-style: normal;
        line-height: 0;
        text-align: center;
        text-transform: none;
        vertical-align: -0.125em;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }
    .apsara-result-title {
        color: ${({ theme }) => theme?.states?.text};
        font-size: ${({ theme }) => theme?.fontSizes[3]};
        font-weight: bold;
        line-height: 1.4;
        text-align: center;
    }
    .apsara-result-subtitle {
        color: ${({ theme }) => theme?.states?.text};
        line-height: 1.4;
        margin-top: 12px;
        overflow: auto;
        max-height: calc(100vh - 500px);
        max-width: 80vw;
    }
    .apsara-result-extra {
        margin: 24px 0 0 0;
        text-align: center;
    }
`;
