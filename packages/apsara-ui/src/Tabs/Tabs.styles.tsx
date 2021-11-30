import styled from "styled-components";
import { Tabs } from "antd";

export const StyledTabs = styled(Tabs)`
    .ant-tabs-ink-bar {
        bottom: 0px;
    }

    .ant-tabs-nav {
        margin: 0 0 24px 0;
    }

    &.primary {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab {
                    color: ${({ theme }) => theme?.colors?.primary[4]};
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    letter-spacing: 0.35px;
                    height: 40px;
                    padding-right: 0px;
                    padding-left: 0px;

                    .ant-tabs-tab-btn:focus,
                    .ant-tabs-tab-btn:active {
                        color: ${({ theme }) => theme?.colors?.primary[6]};
                    }

                    &:hover {
                        color: ${({ theme }) => theme?.colors?.primary[5]};
                    }

                    &.ant-tabs-tab-disabled {
                        color: ${({ theme }) => theme?.colors?.black[5]};

                        .ant-tabs-tab-btn:focus,
                        .ant-tabs-tab-btn:active {
                            color: ${({ theme }) => theme?.colors?.black[5]};
                        }
                    }
                }

                .ant-tabs-tab-active {
                    color: ${({ theme }) => theme?.colors?.primary[6]};

                    .ant-tabs-tab-btn {
                        color: ${({ theme }) => theme?.colors?.primary[6]};
                    }
                }

                .ant-tabs-ink-bar {
                    background-color: ${({ theme }) => theme?.colors?.primary[6]};
                }
            }
        }
    }

    &.secondary {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab {
                    color: ${({ theme }) => theme?.colors?.black[7]};
                    font-size: 16px;
                    font-weight: 500;
                    letter-spacing: 0.4px;

                    .ant-tabs-tab-btn:focus,
                    .ant-tabs-tab-btn:active {
                        color: ${({ theme }) => theme?.colors?.black[9]};
                    }

                    &:hover {
                        color: ${({ theme }) => theme?.colors?.black[8]};
                    }

                    &.ant-tabs-tab-disabled {
                        color: ${({ theme }) => theme?.colors?.black[4]};

                        .ant-tabs-tab-btn:focus,
                        .ant-tabs-tab-btn:active {
                            color: ${({ theme }) => theme?.colors?.black[4]};
                        }
                    }
                }

                .ant-tabs-tab-active {
                    color: ${({ theme }) => theme?.colors?.black[9]};

                    .ant-tabs-tab-btn {
                        color: ${({ theme }) => theme?.colors?.black[9]};
                    }
                }

                .ant-tabs-ink-bar {
                    background-color: ${({ theme }) => theme?.colors?.black[9]};
                }
            }
        }
    }

    &.thin {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab {
                    color: ${({ theme }) => theme?.colors?.black[7]};
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 0.4px;

                    .ant-tabs-tab-btn:focus,
                    .ant-tabs-tab-btn:active {
                        color: ${({ theme }) => theme?.colors?.black[9]};
                    }

                    &:hover {
                        color: ${({ theme }) => theme?.colors?.black[8]};
                    }

                    &.ant-tabs-tab-disabled {
                        color: ${({ theme }) => theme?.colors?.black[4]};

                        .ant-tabs-tab-btn:focus,
                        .ant-tabs-tab-btn:active {
                            color: ${({ theme }) => theme?.colors?.black[4]};
                        }
                    }
                }

                .ant-tabs-tab-active {
                    color: ${({ theme }) => theme?.colors?.black[9]};

                    .ant-tabs-tab-btn {
                        color: ${({ theme }) => theme?.colors?.black[9]};
                    }
                }

                .ant-tabs-ink-bar {
                    background-color: ${({ theme }) => theme?.colors?.black[9]};
                }
            }
        }
    }

    &.secondary,
    &.thin {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab {
                    padding: 8px 0px;
                    line-height: 16px;
                }
            }
        }
    }

    &.secondary.border-top,
    &.thin {
        > .ant-tabs-nav {
            padding-top: 6px;
            border-top: 1px solid ${({ theme }) => theme?.colors?.black[3]};
            position: relative;

            > .ant-tabs-extra-content {
                float: right;
                position: absolute;
                right: 0;
                top: -1px;
                z-index: 500;
            }
        }
    }

    &.thin {
        > .ant-tabs-nav {
            border-top: none;
            padding-top: 0;

            > .ant-tabs-extra-content {
                top: -4px;
            }
        }
    }

    // Margin sizes for tab
    & > .ant-tabs-nav {
        .ant-tabs-nav-list {
            .ant-tabs-tab + .ant-tabs-tab {
                margin: 0 0 0 48px;
            }
        }
    }

    &.xs {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab + .ant-tabs-tab {
                    margin: 0 0 0 32px;
                }
            }
        }
    }

    &.lg {
        & > .ant-tabs-nav {
            .ant-tabs-nav-list {
                .ant-tabs-tab + .ant-tabs-tab {
                    margin: 0 0 0 96px;
                }
            }
        }
    }
`;
