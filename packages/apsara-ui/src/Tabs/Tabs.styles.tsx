import styled, { css } from "styled-components";
import { mauve } from "@radix-ui/colors";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const StyledTabs = styled(TabsPrimitive.Root)`
    display: flex;
    flex-direction: column;
    width: 100%;
    [role="tabpanel"] {
        overflow-y: auto;
        height: calc(100% - 0px);
    }
`;

const StyledList = styled(TabsPrimitive.List)<{ size: "xs" | "md" | "lg" }>`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    border-bottom: 1px solid ${mauve.mauve6};
    ${({ size }) =>
        size === "xs"
            ? css`
                  gap: 20px;
              `
            : size === "md"
            ? css`
                  gap: 34px;
              `
            : css`
                  gap: 82px;
              `}

    & .right {
        margin-left: auto;
        margin-bottom: 5px;
    }

    & .left {
        margin-bottom: 5px;
    }
`;

const StyledTrigger = styled(TabsPrimitive.Trigger)<{
    typ: "primary" | "secondary" | "thin";
}>`
    all: unset;
    font-family: inherit;
    background-color: white;
    padding: 10px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    line-height: 1em;
    transition: box-shadow 0.6s;
    user-select: none;
    &:first-child {
        border-top-left-radius: 6px;
    }
    &:last-child {
        border-top-right-radius: 6px;
    }
    &[data-state="active"] {
        box-shadow: inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;
    }
    &:focus {
        position: relative;
    }
    ${({ typ, theme }) =>
        typ === "primary"
            ? css`
                  color: ${theme?.colors?.primary[4]};
                  font-weight: 500;
                  letter-spacing: 0.35px;
                  &[data-state="active"] {
                      color: ${theme?.colors?.primary[6]};
                  }
                  &:hover {
                      color: ${theme?.colors?.primary[5]};
                  }
                  &:focus {
                      color: ${theme?.colors?.primary[6]};
                  }

                  &[disabled] {
                      color: ${theme?.colors?.black[5]};
                      cursor: not-allowed;
                      &:hover,
                      &:focus,
                      &:active {
                          color: ${theme?.colors?.black[5]};
                      }
                  }
              `
            : typ === "secondary"
            ? css`
                  color: ${theme?.colors?.black[7]};
                  font-size: 16px;
                  font-weight: 500;
                  letter-spacing: 0.4px;
                  &[data-state="active"] {
                      color: ${theme?.colors?.black[9]};
                  }
                  &:hover {
                      color: ${theme?.colors?.black[8]};
                  }
                  &:focus {
                      color: ${theme?.colors?.black[9]};
                  }

                  &[disabled] {
                      color: ${theme?.colors?.black[4]};
                      cursor: not-allowed;
                      &:hover,
                      &:focus,
                      &:active {
                          color: ${theme?.colors?.black[4]};
                      }
                  }
              `
            : typ == "thin"
            ? css`
                  color: ${theme?.colors?.black[7]};
                  font-size: 12px;
                  font-weight: bold;
                  letter-spacing: 0.4px;
                  &[data-state="active"] {
                      color: ${theme?.colors?.black[9]};
                  }
                  &:hover {
                      color: ${theme?.colors?.black[8]};
                  }
                  &:focus {
                      color: ${theme?.colors?.black[9]};
                  }

                  &[disabled] {
                      color: ${theme?.colors?.black[4]};
                      cursor: not-allowed;
                      &:hover,
                      &:focus,
                      &:active {
                          color: ${theme?.colors?.black[4]};
                      }
                  }
              `
            : null}
`;

const StyledContent = styled(TabsPrimitive.Content)`
    flex-grow: 1;
    padding: 10px;
    padding-top: 20px;
    background-color: white;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    outline: none;
`;

// Exports
export const Tabs = StyledTabs;
export const TabsList = StyledList;
export const TabsTrigger = StyledTrigger;
export const TabsContent = StyledContent;

export const Styledabs = styled(Tabs)`
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
