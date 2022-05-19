import styled from "styled-components";
import { Table, Empty, EmptyProps } from "antd";
import { VariableSizeGrid } from "react-window";
import { textStyles } from "../mixin";

export const StyledTable = styled(Table)`
    .ant-table {
        background: transparent;
        background-color: ${({ theme }) => theme?.table?.bg};
    }

    .ant-table-body,
    .ant-table-container {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.table?.text)}

        .ant-table-thead>tr>th,
        .ant-table-tbody>tr>td,
        .virtual-table-cell {
            --cell-padding-tb: 13px;
            --cell-padding-lr: 16px;

            min-width: 120px;
            padding: var(--cell-padding-tb) var(--cell-padding-lr);
            border-color: ${({ theme }) => theme?.table?.border};
            border-bottom: 1px solid ${({ theme }) => theme?.table?.border};
            background-color: transparent;
        }

        .ant-table-thead {
            .ant-table-column-title {
                text-transform: capitalize;
            }
            th {
                font-weight: bold;
                color: ${({ theme }) => theme?.table?.heading};
            }
        }

        .ant-table-thead
            > tr
            > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
            background-color: ${({ theme }) => theme?.table?.border};
        }

        .ant-table-tbody > tr > td,
        .virtual-table-cell {
            cursor: pointer;

            a {
                display: block;
                color: inherit;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 13px 16px;
                margin: -13px -16px;
            }

            span.highlight,
            div.highlight {
                a:hover {
                    color: ${({ theme }) => theme?.colors?.primary[4]};
                }
            }

            span.highlight {
                width: 100%;
            }

            & > a:only-child {
                width: 100%;
            }
        }

        .ant-table-tbody > tr > td.ant-table-column-sort {
            background: unset;
        }

        .ant-table-tbody > tr.ant-table-row:hover > td {
            background: ${({ theme }) => theme?.table?.highlight};
        }

        // FIX ME
        .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-inner .ant-table-column-sorter-up,
        .ant-table-thead
            > tr
            > th
            .ant-table-column-sorter
            .ant-table-column-sorter-inner
            .ant-table-column-sorter-down {
            font-size: 10px;
        }

        .ant-table-row {
            cursor: pointer;
            height: 48px;

            &.highlightRow {
                background: ${({ theme }) => theme?.table?.highlight};

                td:last-child {
                    border-right: 1px solid ${({ theme }) => theme?.colors?.primary[3]};
                }

                td .highlight:hover {
                    color: ${({ theme }) => theme?.colors?.primary[4]} !important;
                }
            }

            td:first-child {
                ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.table?.title)}
            }

            td.text-hover-highlight .highlight a {
                display: inline-block;
            }

            &:hover > td:first-child:not(.text-hover-highlight),
            td.text-hover-highlight .highlight:hover,
            .virtual-table-first-child:hover {
                color: ${({ theme }) => theme?.colors?.primary[4]} !important;
            }
        }

        .ant-table-column-title {
            font-weight: bold;
            letter-spacing: 0.3px;
        }

        .anticon {
            margin-right: 10px;
        }

        .ant-table-row td.table-description {
            line-height: 16px !important;
        }
    }

    &.alternate {
        tbody tr:nth-child(odd),
        .virtual-table-odd {
            background: ${({ theme }) => theme?.table?.highlight};
        }

        .ant-table-tbody > tr > td,
        .virtual-table-cell {
            border-bottom: none;
        }

        .ant-table-row,
        .virtual-table-cell {
            cursor: text;

            &:hover {
                td:first-child {
                    ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.table?.title)}
                }
            }

            height: 40px;

            td {
                line-height: 14px;
            }
        }

        .ant-table-tbody > tr:hover > td {
            background: transparent;
        }
    }

    &.alternate-hover {
        .ant-table-row {
            td:first-child {
                border-left: 1px solid transparent;
            }

            &:hover td:first-child {
                border-left: 1px solid ${({ theme }) => theme?.colors?.primary[3]};
            }

            &:hover td a {
                text-decoration: underline;
            }
        }
    }

    .ant-table-placeholder {
        border-bottom: 0;
    }

    .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after,
    .ant-table-ping-left:not(.ant-table-has-fix-left) .ant-table-container::before {
        box-shadow: none;
    }
`;

export const StyledGrid = styled(VariableSizeGrid)`
    height: calc(100vh - 300px);

    .virtual-table-cell {
        display: flex;
        align-items: center;
        height: 48px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: transparent;
        &.highlightRow {
            background: ${({ theme }) => theme?.table?.highlight};

            &.virtual-table-last-child {
                border-right: 2px solid ${({ theme }) => theme?.colors?.primary[3]};
            }
        }
    }

    .virtual-table-first-child {
        ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.table?.title)}
    }

    .virtual-table-first-child:hover {
        a {
            color: ${({ theme }) => theme?.colors?.primary[4]} !important;
        }
    }
`;

export const StyledEmpty: React.FC<EmptyProps> = styled(Empty)`
    margin: 90px 8px;

    .ant-empty-footer {
        margin-top: 32px;
    }

    .ant-empty-image {
        height: 100%;
    }
`;

export const EmptyHeader = styled.p`
    ${({ theme }) => textStyles(theme?.fontSizes[2], theme?.table?.empty, "0.5px", "bold")}
    line-height: 16px;
`;

export const EmptyText = styled.p`
    ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.table?.empty)}
    line-height: 16px;
`;
