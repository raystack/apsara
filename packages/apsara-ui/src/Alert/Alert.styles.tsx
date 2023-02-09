import styled from "styled-components";

export const AlertWrapper = styled.div`
    .apsara-alert {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        position: relative;
        display: flex;
        align-items: center;
        padding: 8px 15px;
        word-wrap: break-word;
        border-radius: 2px;

        &-content {
            flex: 1;
            min-width: 0;
        }
        &-icon {
            margin-right: 8px;
        }
        &-description {
            display: none;
            font-size: 14px;
            line-height: 22px;
        }

        &-success {
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;

            .apsara-alert-icon {
                color: #52c41a;
            }
        }
        &-info {
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;

            .apsara-alert-icon {
                color: #1890ff;
            }
        }
        &-warning {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;

            .apsara-alert-icon {
                color: #faad14;
            }
        }
        &-error {
            background-color: #fff2f0;
            border: 1px solid #ffccc7;

            .apsara-alert-icon {
                color: #ff4d4f;
            }

            .apsara-alert-description > pre {
                margin: 0;
                padding: 0;
            }
        }

        &-action {
            margin-left: 8px;
        }

        &-with-description {
            align-items: flex-start;
            padding: 15px 15px 15px 24px;

            &.apsara-alert-no-icon {
                padding: 15px 15px;
            }
            .apsara-alert-icon {
                margin-right: 15px;
                font-size: 24px;
            }

            .apsara-alert-message {
                display: block;
                margin-bottom: 4px;
                color: rgba(0, 0, 0, 0.85);
                font-size: 16px;
            }
            .apsara-alert-description {
                display: block;
            }
        }

        &-message {
            color: rgba(0, 0, 0, 0.85);
        }
    }
`;
