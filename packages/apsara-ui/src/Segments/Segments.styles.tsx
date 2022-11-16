import styled, { css } from "styled-components";
import { capitalize } from "../mixin";
import { StyledTag } from "../Tag/Tag.styles";

export const Row = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 16px;
    font-size: ${({ theme }) => theme?.fontSizes[0]};
`;

export const Key = styled.div`
    ${capitalize}
    color: ${({ theme }) => theme?.segments?.key};
    font-weight: bold;
`;

export const Value = styled.div`
    letter-spacing: 0.3px;
    color: ${({ theme }) => theme?.segments?.value};
    word-break: break-word;

    ${StyledTag} {
        margin-right: 16px;
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const Title = styled.div`
    ${capitalize}
    font-size: ${({ theme }) => theme?.fontSizes[1]};
    font-weight: bold;
    color: ${({ theme }) => theme?.segments?.title};
    margin-bottom: 16px;
    letter-spacing: 0.3px;

    & + ${Row} {
        margin-top: 0;
    }
`;

export const Wrapper = styled.div<{ $advance?: boolean }>`
    display: flex;
    flex-direction: column;
    padding: ${({ $advance }) => ($advance ? "32px 0px 0px 0px" : "24px 0px 32px 0px")};
    background-color: ${({ theme }) => theme?.segments?.bg};

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme?.segments?.border};
    }

    &:first-child {
        padding: 0px 0px 32px 0px;
    }

    ${({ $advance }) =>
        $advance &&
        css`
            .ant-collapse {
                background: transparent;

                .ant-collapse-header {
                    padding: 0px;
                    padding-right: 40px;
                    font-size: ${({ theme }) => theme?.fontSizes[1]};
                    color: ${({ theme }) => theme?.segments?.title};
                    letter-spacing: 0.3px;
                    font-weight: bold;
                    display: inline-block;
                }

                .ant-collapse-content {
                    .ant-collapse-content-box {
                        padding-bottom: 0px;
                        padding-left: 0px;
                        padding-right: 0px;
                    }
                }

                .ant-collapse-item {
                    border-bottom: 0px;
                }
            }
        `}
`;

export const CollapsibleHeader = styled.div`
        font-size: ${({ theme }) => theme?.fontSizes[1]};
        color: ${({ theme }) => theme?.segments?.title};
        letter-spacing: 0.3px;
        font-weight: bold;
        display: flex;
        align-items: center;
`