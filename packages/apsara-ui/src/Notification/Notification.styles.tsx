import { css } from "styled-components";

export const NotificationStyle = css`
    .ant-notification {
        width: fit-content;
        min-width: 384px;
        max-width: 420px;
        color: ${({ theme }) => theme?.notification?.text};

        .ant-notification-notice {
            background: ${({ theme }) => theme?.notification?.bg};
        }

        .ant-notification-notice-with-icon {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .ant-notification-notice-message {
                margin-bottom: 0px;
                font-weight: bold;
                font-size: ${({ theme }) => theme?.fontSizes[2]};
                letter-spacing: 0.4px;
                color: ${({ theme }) => theme?.notification?.text};
            }
        }

        .ant-notification-notice-close {
            color: ${({ theme }) => theme?.colors?.black[5]};
        }
        .ant-notification-notice-close:hover {
            color: ${({ theme }) => theme?.colors?.black[6]};
        }

        .ant-notification-notice-success .ant-notification-notice-icon {
            color: ${({ theme }) => theme?.colors?.success[4]};
        }

        .ant-notification-notice-error .ant-notification-notice-icon {
            color: ${({ theme }) => theme?.colors?.error[4]};
        }

        .custom-notification {
            .ant-notification-notice-icon {
                top: 16px;
            }

            .custom-notification__content {
                margin-top: 6px;
                margin-bottom: 16px;
                font-size: ${({ theme }) => theme?.fontSizes[0]};
                color: ${({ theme }) => theme?.notification?.content};
            }
        }
    }
`;
