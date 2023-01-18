import styled from "styled-components";

export const DatePickerWrapper = styled.div<{ $props?: any }>`
    .apsara-picker {
        box-sizing: border-box;
        margin: 0;
        width: ${({ $props }) => $props?.width};
        color: #000000d9;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        padding: 4px 11px;
        position: relative;
        display: inline-flex;
        align-items: center;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: border 0.3s, box-shadow 0.3s;

        &:hover {
            .apsara-picker-clear {
                opacity: 1;
            }
        }

        &-suffix {
            display: flex;
            flex: none;
            align-self: center;
            margin-left: 4px;
            color: #00000040;
            line-height: 1;
            pointer-events: none;
        }

        &:hover,
        &-focused {
            border-color: #40a9ff;
            border-right-width: 1px;
        }

        .apsara-picker-input {
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 100%;

            a,
            area,
            button,
            [role="button"],
            input:not([type="range"]),
            label,
            select,
            summary,
            textarea {
                touch-action: manipulation;
            }

            > input {
                position: relative;
                display: inline-block;
                width: 100%;
                min-width: 0;
                color: #000000d9;
                font-size: 14px;
                line-height: 1.5715;
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                transition: all 0.3s;
                flex: auto;
                min-width: 1px;
                height: auto;
                padding: 0;
                background: 0 0;
                border: 0;

                &:hover {
                    border-color: #40a9ff;
                    border-right-width: 1px;
                }
                &:focus {
                    box-shadow: none !important;
                }
                &:focus,
                &-focused {
                    border-color: #40a9ff;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                    border-right-width: 1px;
                    outline: 0;
                }

                &:placeholder-shown {
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .apsara-picker-clear {
        position: absolute;
        top: 50%;
        right: 0;
        color: #00000040;
        line-height: 1;
        background: #fff;
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, color 0.3s;
        &:hover {
            color: #00000073;
        }
    }
`;

export const RangePickerWrapper = styled.div<{ $props?: any }>`
    .apsara-picker-range {
        width: ${({ $props }) => $props?.width};
        position: relative !important;
        display: inline-flex !important;
        &.apsara-picker-focused .apsara-picker-active-bar {
            opacity: 1;
        }
        .apsara-picker-active-bar {
            bottom: -1px;
            height: 2px;
            margin-left: 11px;
            background: #1890ff;
            opacity: 0;
            transition: all 0.3s ease-out;
            pointer-events: none;
        }
        .apsara-picker-clear {
            right: 11px;
        }
        &:hover {
            .apsara-picker-clear {
                opacity: 1;
            }
        }
    }

    .apsara-picker-clear {
        position: absolute;
        top: 50%;
        right: 0;
        color: #00000040;
        line-height: 1;
        background: #fff;
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, color 0.3s;
        &:hover {
            color: #00000073;
        }
    }

    .apsara-picker {
        box-sizing: border-box;
        margin: 0;
        color: #000000d9;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        padding: 4px 11px;
        position: relative;
        display: inline-flex;
        align-items: center;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: border 0.3s, box-shadow 0.3s;

        &:hover {
            border-color: #40a9ff;
            border-right-width: 1px;
        }
        &-suffix {
            display: flex;
            flex: none;
            align-self: center;
            margin-left: 4px;
            color: #00000040;
            line-height: 1;
            pointer-events: none;
        }

        &-input {
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 100%;
            &-placeholder {
                > input {
                    color: #bfbfbf !important;
                }
            }

            > input {
                position: relative;
                display: inline-block;
                width: 100%;
                min-width: 0;
                color: #000000d9;
                font-size: 14px;
                line-height: 1.5715;
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                transition: all 0.3s;
                flex: auto;
                min-width: 1px;
                height: auto;
                padding: 0;
                background: 0 0;
                border: 0;
                &:placeholder-shown {
                    text-overflow: ellipsis;
                }
                &:not([type="range"]) {
                    touch-action: manipulation;
                }
                &:focus {
                    box-shadow: none !important;
                }
                &:focus,
                &-focused {
                    border-color: #40a9ff;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                    border-right-width: 1px;
                    outline: 0;
                }
            }
        }
        &-range-separator {
            align-items: center;
            padding: 0 8px;
            line-height: 1;

            .apsara-picker-separator {
                position: relative;
                display: inline-block;
                width: 1em;
                height: 16px;
                color: #00000040;
                font-size: 16px;
                vertical-align: top;
                cursor: default;
            }
        }
    }
`;

export const PickerDropdownWrapper = styled.div`
    .apsara-picker-dropdown {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        position: absolute;
        z-index: 1050;

        &-hidden {
            display: none;
        }

        &-range {
            padding: 7.54247233px 0;
        }

        .apsara-picker-range-wrapper {
            display: flex;
        }

        .apsara-picker-range-arrow {
            position: absolute;
            z-index: 1;
            display: none;
            width: 11.3137085px;
            height: 11.3137085px;
            margin-left: 16.5px;
            box-shadow: 2px 2px 6px -2px #0000001a;
            transition: left 0.3s ease-out;
            border-radius: 0 0 2px;
            pointer-events: none;

            &:before {
                position: absolute;
                top: -11.3137085px;
                left: -11.3137085px;
                width: 33.9411255px;
                height: 33.9411255px;
                background: #fff;
                background-repeat: no-repeat;
                background-position: -10px -10px;
                content: "";
                -webkit-clip-path: inset(33% 33%);
                clip-path: inset(33% 33%);
                -webkit-clip-path: path(
                    "M 9.849242404917499 24.091883092036785 A 5 5 0 0 1 13.384776310850237 22.627416997969522 L 20.627416997969522 22.627416997969522 A 2 2 0 0 0 22.627416997969522 20.627416997969522 L 22.627416997969522 13.384776310850237 A 5 5 0 0 1 24.091883092036785 9.849242404917499 L 23.091883092036785 9.849242404917499 L 9.849242404917499 23.091883092036785 Z"
                );
                clip-path: path(
                    "M 9.849242404917499 24.091883092036785 A 5 5 0 0 1 13.384776310850237 22.627416997969522 L 20.627416997969522 22.627416997969522 A 2 2 0 0 0 22.627416997969522 20.627416997969522 L 22.627416997969522 13.384776310850237 A 5 5 0 0 1 24.091883092036785 9.849242404917499 L 23.091883092036785 9.849242404917499 L 9.849242404917499 23.091883092036785 Z"
                );
            }
        }
    }

    .apsara-picker-panel-container {
        overflow: hidden;
        vertical-align: top;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
        transition: margin 0.3s;

        .apsara-picker-panels {
            display: inline-flex;
            flex-wrap: nowrap;
            direction: ltr;
        }

        .apsara-picker-footer {
            width: -moz-min-content;
            width: min-content;
            min-width: 100%;
            line-height: 38px;
            text-align: center;
            border-bottom: 1px solid transparent;
            > ul {
                margin: 0;
            }

            .apsara-picker-ranges {
                margin-bottom: 0;
                padding: 4px 12px;
                overflow: hidden;
                line-height: 34px;
                text-align: left;
                list-style: none;

                .apsara-picker-ok {
                    float: right;
                    margin-left: 8px;
                }
                .apsara-picker-now {
                    text-align: left;
                }
                > li {
                    display: inline-block;
                }
            }
        }

        .apsara-picker-panel {
            vertical-align: top;
            background: 0 0;
            border-width: 0 0 1px;
            border-radius: 0;
        }
    }

    .apsara-picker-panel {
        display: inline-flex;
        flex-direction: column;
        text-align: center;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 2px;
        outline: none;

        .apsara-picker-content,
        .apsara-picker-panel-container .apsara-picker-panel table {
            text-align: center;
        }

        .apsara-picker-datetime-panel {
            display: flex;

            .apsara-picker-date-panel,
            .apsara-picker-time-panel {
                transition: opacity 0.3s;
            }

            .apsara-picker-time-panel {
                border-left: 1px solid rgba(0, 0, 0, 0.06);
            }
        }

        .apsara-picker-time-panel {
            width: auto;
            min-width: auto;

            .apsara-picker-content {
                display: flex;
                flex: auto;
                height: 224px;
            }
        }
        .apsara-picker-content {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;

            .apsara-picker-time-panel-column {
                flex: 1 0 auto;
                width: 56px;
                margin: 0;
                padding: 0;
                overflow-y: hidden;
                text-align: left;
                list-style: none;
                transition: background 0.3s;

                &:not(:first-child) {
                    border-left: 1px solid rgba(0, 0, 0, 0.06);
                }

                > li {
                    margin: 0;
                    padding: 0;

                    &.apsara-picker-time-panel-cell .apsara-picker-time-panel-cell-inner {
                        display: block;
                        width: 100%;
                        height: 28px;
                        margin: 0;
                        padding: 0 0 0 14px;
                        color: #000000d9;
                        line-height: 28px;
                        border-radius: 0;
                        cursor: pointer;
                        transition: background 0.3s;

                        &:hover {
                            background: #f5f5f5;
                        }
                    }
                }

                &:hover {
                    overflow-y: auto;
                }
            }
        }

        .apsara-picker-footer {
            border-top: 1px solid rgba(0, 0, 0, 0.06);

            .apsara-picker-today-btn {
                color: #1890ff;
                cursor: pointer;
                :hover {
                    color: #40a9ff;
                }
            }
            .apsara-picker-now-btn {
                color: #1890ff;
                cursor: pointer;
                :hover {
                    color: #40a9ff;
                }
            }
        }
    }

    .apsara-picker-decade-panel,
    .apsara-picker-year-panel,
    .apsara-picker-quarter-panel,
    .apsara-picker-month-panel,
    .apsara-picker-week-panel,
    .apsara-picker-date-panel,
    .apsara-picker-time-panel {
        display: flex;
        flex-direction: column;
        width: 280px;
    }
    .apsara-picker-date-panel {
        .apsara-picker-body {
            padding: 8px 12px;
        }
        .apsara-picker-content {
            width: 252px;
        }
        th {
            width: 36px;
        }
    }

    .apsara-picker-content {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        th {
            height: 30px;
            color: #000000d9;
            line-height: 30px;
        }
    }

    .apsara-picker-content th,
    .apsara-picker-content td {
        position: relative;
        min-width: 24px;
        font-weight: 400;
    }

    .apsara-picker-header {
        display: flex;
        padding: 0 8px;
        color: #000000d9;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);

        [type="button"] {
            -webkit-appearance: button;
        }
        > button {
            min-width: 1.6em;
            font-size: 14px;
        }
        button {
            padding: 0;
            color: #00000040;
            line-height: 40px;
            background: 0 0;
            border: 0;
            cursor: pointer;
            transition: color 0.3s;
        }

        .apsara-picker-prev-icon,
        .apsara-picker-super-prev-icon {
            transform: rotate(-45deg);
        }
        .apsara-picker-next-icon,
        .apsara-picker-super-next-icon {
            transform: rotate(135deg);
        }

        .apsara-picker-prev-icon,
        .apsara-picker-next-icon,
        .apsara-picker-super-prev-icon,
        .apsara-picker-super-next-icon {
            position: relative;
            display: inline-block;
            width: 7px;
            height: 7px;
        }

        .apsara-picker-prev-icon:before,
        .apsara-picker-next-icon:before,
        .apsara-picker-super-prev-icon:before,
        .apsara-picker-super-next-icon:before {
            position: absolute;
            top: 0;
            left: 0;
            display: inline-block;
            width: 7px;
            height: 7px;
            border: 0 solid currentcolor;
            border-width: 1.5px 0 0 1.5px;
            content: "";
        }

        .apsara-picker-super-prev-icon:after,
        .apsara-picker-super-next-icon:after {
            position: absolute;
            top: 4px;
            left: 4px;
            display: inline-block;
            width: 7px;
            height: 7px;
            border: 0 solid currentcolor;
            border-width: 1.5px 0 0 1.5px;
            content: "";
        }

        &-view {
            flex: auto;
            font-weight: 500;
            line-height: 40px;

            button {
                color: inherit;
                font-weight: inherit;
                &:hover {
                    color: #1890ff;
                }
                &:not(:first-child) {
                    margin-left: 8px;
                }
            }
        }
    }

    .apsara-picker-cell-disabled {
        color: #00000040 !important;
        pointer-events: none;

        &.apsara-picker-cell-today .apsara-picker-cell-inner:before {
            border-color: #00000040 !important;
        }

        &:before {
            background: rgba(0, 0, 0, 0.04);
        }
    }
    .apsara-picker-cell {
        padding: 3px 0;
        color: #00000040;
        cursor: pointer;
        &:before {
            position: absolute;
            top: 50%;
            right: 0;
            left: 0;
            z-index: 1;
            height: 24px;
            transform: translateY(-50%);
            transition: all 0.3s;
            content: "";
        }

        .apsara-picker-cell-inner {
            position: relative;
            z-index: 2;
            display: inline-block;
            min-width: 24px;
            height: 24px;
            line-height: 24px;
            border-radius: 2px;
            transition: background 0.3s, border 0.3s;

            &:hover {
                background: #f5f5f5;
            }
        }
    }
    .apsara-picker-cell-in-view {
        color: #000000d9;

        &.apsara-picker-cell-selected .apsara-picker-cell-inner,
        .apsara-picker-cell-in-view.apsara-picker-cell-range-start .apsara-picker-cell-inner,
        .apsara-picker-cell-in-view.apsara-picker-cell-range-end .apsara-picker-cell-inner {
            color: #fff;
            background: #1890ff;
        }

        &.apsara-picker-cell-today .apsara-picker-cell-inner::before {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            border: 1px solid #1890ff;
            border-radius: 2px;
            content: "";
        }
    }

    .apsara-picker-date-panel .apsara-picker-body {
        padding: 8px 12px;
    }

    .apsara-picker-dropdown-placement-bottomLeft .apsara-picker-range-arrow {
        top: 2.58561808px;
        display: block;
        transform: rotate(-135deg) translateY(1px);
    }
`;
