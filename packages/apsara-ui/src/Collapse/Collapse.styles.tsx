import styled from "styled-components";

export const CollapseWrapper = styled.div`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #000000d9;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum";
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-bottom: 0;
    border-radius: 2px;
    background-color: transparent;
    border: 0;

    .apsara-collapse-item {
        border-bottom: 0;

        .apsara-collapse-header {
            position: relative;
            display: flex;
            flex-wrap: nowrap;
            align-items: flex-start;
            padding: 12px 0;
            color: #000000d9;
            line-height: 1.5715;
            cursor: pointer;
            transition: all 0.3s, visibility 0s;
            align-items: center;
        }

        .apsara-collapse-content {
            background-color: transparent;
            border-top: 0;

            &-hidden {
                display: none;
            }

            &[data-state="open"] {
                animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
            }
            &[data-state="closed"] {
                animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1);
            }

            @keyframes slideDown {
                0% {
                    height: 0;
                }
                100% {
                    height: var(--radix-collapsible-content-height);
                }
            }

            @keyframes slideUp {
                0% {
                    height: var(--radix-collapsible-content-height);
                }
                100% {
                    height: 0;
                }
            }

            .apsara-collapse-content-box {
                padding-top: 12px;
                padding-bottom: 12px;
            }
        }
    }
`;

export const CollapsibleHeader = styled.div`
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;

    &[data-state="open"] {
        svg {
            transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
            transform: rotate(90deg);
        }
    }
    &[data-state="closed"] {
        svg {
            transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
            transform: rotate(0deg);
        }
    }
`;
