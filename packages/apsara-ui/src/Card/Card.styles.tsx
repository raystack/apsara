import styled from "styled-components";

export const CardWrapper = styled.div`
    .apsara-card {
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
        background: #fff;
        border-radius: 2px;

        &-head {
            min-height: 48px;
            margin-bottom: -1px;
            padding: 0 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            background: transparent;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 2px 2px 0 0;

            &::before {
                display: table;
                content: "";
            }
            &::after {
                display: table;
                clear: both;
                content: "";
            }
            &-wrapper {
                display: flex;
                align-items: center;
            }
            &-title {
                display: inline-block;
                flex: 1;
                padding: 16px 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        &-body {
            padding: 24px;

            &::before {
                display: table;
                content: "";
            }
            &::after {
                display: table;
                clear: both;
                content: "";
            }
        }

        &-bordered {
            border: 1px solid #f0f0f0;
        }
    }

    .apsara-card-small {
        .apsara-card-head {
            min-height: 36px;
            padding: 0 12px;
            font-size: 14px;

            &-wrapper {
                .apsara-card-head-title {
                    padding: 8px 0;
                }
                .apsara-card-extra {
                    padding: 8px 0;
                    font-size: 14px;
                }
            }
        }
        .apsara-card-body {
            padding: 12px;
        }
    }
`;
