import styled from "styled-components";

export const StyledRcInputNumberWrapper = styled.div`
    .apsara-input-number {
        box-sizing: border-box;
        font-variant: tabular-nums;
        list-style: none;
        font-feature-settings: "tnum";
        position: relative;
        width: 100%;
        min-width: 0;
        color: #000000d9;
        font-size: 14px;
        line-height: 1.5715;
        background-color: #fff;
        background-image: none;
        transition: all 0.3s;
        display: inline-block;
        width: 90px;
        margin: 0;
        padding: 0;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        &-focused,
        &:hover:not(&-disabled) {
            .apsara-input-number-handler-wrap {
                opacity: 1 !important;
            }
        }
        &-disabled {
            color: rgba(0, 0, 0, 0.25);
            background-color: #f5f5f5;
            border-color: #d9d9d9;
            box-shadow: none;
            cursor: not-allowed;
            opacity: 1;
        }
        &-lg {
            padding: 0 !important;
            font-size: 16px !important;
            input {
                height: 38px !important;
            }
        }
        &-sm {
            padding: 0;
            input {
                height: 22px !important;
                padding: 0 7px !important;
            }
        }

        .apsara-input-number-handler-up-inner {
            top: 50%;
            margin-top: -5px;
            text-align: center;
        }
        .apsara-input-number-handler-down-inner {
            top: 50%;
            text-align: center;
            transform: translateY(-50%);
        }
        .apsara-input-number-handler-up-inner,
        .apsara-input-number-handler-down-inner {
            display: inline-block;
            color: inherit;
            font-style: normal;
            line-height: 0;
            text-align: center;
            text-transform: none;
            vertical-align: -0.125em;
            text-rendering: optimizelegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            position: absolute;
            right: 4px;
            width: 12px;
            height: 12px;
            color: #00000073;
            line-height: 12px;
            transition: all 0.1s linear;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .apsara-input-number-handler-wrap .apsara-input-number-handler .apsara-input-number-handler-up-inner,
        .apsara-input-number-handler-wrap .apsara-input-number-handler .apsara-input-number-handler-down-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: auto;
            margin-right: 0;
            font-size: 7px;
        }

        .apsara-input-number-handler-wrap {
            position: absolute;
            top: 0;
            right: 0;
            width: 22px;
            height: 100%;
            background: #fff;
            border-radius: 0 2px 2px 0;
            opacity: 0;
            transition: opacity 0.24s linear 0.1s;
            display: flex;
            flex-direction: column;

            .apsara-input-number-handler {
                position: relative;
                display: block;
                width: 100%;
                height: 50%;
                overflow: hidden;
                color: #00000073;
                font-weight: 700;
                line-height: 0;
                text-align: center;
                border-left: 1px solid #d9d9d9;
                transition: all 0.1s linear;
            }
            .apsara-input-number-handler-up {
                border-top-right-radius: 2px;
                cursor: pointer;
                &:hover {
                    height: 60% !important;
                    .apsara-input-number-handler-up-inner {
                        color: #40a9ff;
                    }
                }
            }
            .apsara-input-number-handler-down {
                top: 0;
                border-top: 1px solid #d9d9d9;
                border-bottom-right-radius: 2px;
                cursor: pointer;
                &:hover {
                    height: 60% !important;
                    .apsara-input-number-handler-down-inner {
                        color: #40a9ff;
                    }
                }
            }
        }

        .apsara-input-number-input-wrap {
            .apsara-input-number-input {
                width: 100%;
                height: 30px;
                padding: 0 11px;
                text-align: left;
                background-color: transparent;
                border: 0;
                border-radius: 2px;
                outline: 0;
                transition: all 0.3s linear;
                -webkit-appearance: textfield !important;
                -moz-appearance: textfield !important;
                appearance: textfield !important;
                &:disabled {
                    cursor: not-allowed;
                }
            }
        }
    }
`;
