import styled from "styled-components";
import { Collapse } from "antd";

export const DiffTimelineContainer = styled.div`
    margin-left: 16px;

    .ant-collapse-borderless {
        background-color: white;
    }

    .ant-timeline {
        position: relative;
        left: 10px;
    }

    .ant-timeline-item-tail {
        border-left: 1px dashed #4c4c4c;
    }

    .ant-timeline-item-head-black {
        border: 1px solid #4c4c4c !important;
    }

    .ant-timeline-item-content {
        margin-left: 24px;
    }

    .diff-timeline__date-header {
        padding: 8px 0px 8px 0px;
        font-size: 16px;
    }

    .diff-timeline__empty {
        padding: 0px;

        .ant-timeline-item-head-custom {
            display: none;
        }

        .ant-timeline-item-tail {
            top: 0px;
            height: 100%;
        }

        .diff-timeline__empty-content {
            height: 16px;
        }
    }

    .diff-timeline__block {
        padding-bottom: 40px;

        .diff-timeline__reason {
            font-size: 14px;
            text-transform: capitalize;
            font-weight: bold;
            margin-bottom: 8px;
            padding-top: 1px;
        }

        .diff-timeline__details {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .diff-timeline__details-text {
            font-size: 12px;
        }

        .diff-timeline__details-dot {
            margin: 0 12px;
            height: 4px;
            width: 4px;
            border-radius: 15px;
            border: 1px solid black;
            background: #4c4c4c;
        }
    }
`;

export const DiffTableContainer = styled.div`
    border-radius: 2px;
    border: 1px solid 2px;
    width: auto;
    padding: 12px 0px 12px 0px;

    .diff-table__section:not(:last-child) {
        margin-bottom: 16px;
    }

    .diff-table__header {
        font-size: 10px;
        text-transform: capitalize;
        font-weight: bold;
        line-height: 16px;
        margin-bottom: 4px;
        padding-left: 16px;
    }

    .diff-table__text {
        font-size: 12px;
        line-height: 16px;
        padding: 4px 0px 4px 16px;

        .diff-table__sign {
            margin-right: 8px;
            width: 8px;
            display: inline-block;
        }
    }

    .diff-table__text--addition {
        background: #e7f7ef;
    }

    .diff-table__text--deletion {
        background: #fde8ed;
    }

    .diff-table__text--strikethrough {
        text-decoration: line-through;
    }
`;

export const DiffCollapseCOntainer: any = styled(Collapse)`
    .ant-collapse-item {
        border-bottom: none;
    }

    .ant-collapse-header {
        color: #0f6ad6;
    }

    .ant-collapse-arrow {
        color: #0f6ad6;
    }
`;
