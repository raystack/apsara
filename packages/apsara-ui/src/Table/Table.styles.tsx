import styled from "styled-components";
import Table from "rc-table";
import { VariableSizeGrid } from "react-window";
import { textStyles } from "../mixin";

export const StyledTable = styled(Table)`
    .rc-table {
        background: transparent;
        background-color: ${({ theme }) => theme?.table?.bg};
    }

    .rc-table-body,
    .rc-table-container {
        ${({ theme }) => textStyles(theme?.fontSizes[0], theme?.table?.text)}

        .rc-table-content table {
            width: 100%;
            text-align: left;
            border-radius: 2px 2px 0 0;
            border-collapse: separate;
            border-spacing: 0;
        }

        .rc-table-thead>tr>th,
        .rc-table-tbody>tr>td,
        .virtual-table-cell {
            --cell-padding-tb: 13px;
            --cell-padding-lr: 16px;

            min-width: 120px;
            padding: var(--cell-padding-tb) var(--cell-padding-lr);
            border-color: ${({ theme }) => theme?.table?.border};
            border-bottom: 1px solid ${({ theme }) => theme?.table?.border};
            background-color: transparent;
        }

        .rc-table-thead>tr>th{
            text-align:left
        }

        .rc-table-thead {
            .rc-table-column-title {
                text-transform: capitalize;
            }
            th {
                font-weight: bold;
                color: ${({ theme }) => theme?.table?.heading};
            }
        }

        .rc-table-thead
            > tr
            > th:not(:last-child):not(.rc-table-selection-column):not(.rc-table-row-expand-icon-cell):not([colspan])::before {
            background-color: ${({ theme }) => theme?.table?.border};
        }

        .rc-table-tbody > tr > td,
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

        .rc-table-tbody > tr > td.rc-table-column-sort {
            background: unset;
        }

        .rc-table-tbody > tr.rc-table-row:hover > td {
            background: ${({ theme }) => theme?.table?.highlight};
        }

        // FIX ME
        .rc-table-thead > tr > th .rc-table-column-sorter .rc-table-column-sorter-inner .rc-table-column-sorter-up,
        .rc-table-thead
            > tr
            > th
            .rc-table-column-sorter
            .rc-table-column-sorter-inner
            .rc-table-column-sorter-down {
            font-size: 10px;
        }

        .rc-table-row {
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

            td:last-child {
                word-break: break-word;
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

        .rc-table-column-title {
            font-weight: bold;
            letter-spacing: 0.3px;
        }

        .rcicon {
            margin-right: 10px;
        }

        .rc-table-row td.table-description {
            line-height: 16px !important;
        }
    }

    &.alternate {
        tbody tr:nth-child(odd),
        .virtual-table-odd {
            background: ${({ theme }) => theme?.table?.highlight};
        }

        .rc-table-tbody > tr > td,
        .virtual-table-cell {
            border-bottom: none;
        }

        .rc-table-row,
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

        .rc-table-tbody > tr:hover > td {
            background: transparent;
        }
    }

    &.alternate-hover {
        .rc-table-row {
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

    .rc-table-placeholder {
        border-bottom: 0;
    }

    .rc-table-ping-right:not(.rc-table-has-fix-right) .rc-table-container::after,
    .rc-table-ping-left:not(.rc-table-has-fix-left) .rc-table-container::before {
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

export const StyledEmpty = styled.div`
    margin: 90px 8px;
    font-size: 14px;
    line-height: 1.5715;
    text-align: center;

    .rc-empty-footer {
        margin-top: 32px;
    }

    .rc-empty-image {
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
