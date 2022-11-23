import styled from "styled-components";
import * as Collapsible from "@radix-ui/react-collapsible";
export const DiffTimelineContainer = styled.div`
    .apsara-timeline {
        box-sizing: border-box;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        font-feature-settings: "tnum";
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .apsara-timeline-item {
        position: relative;
        margin: 0;
        padding-bottom: 20px;
        font-size: 14px;
        list-style: none;
    }

    .apsara-timeline-item-tail {
        position: absolute;
        top: 10px;
        left: 4px;
        height: calc(100% - 10px);
        border-left: 2px solid #f0f0f0;
    }

    .apsara-timeline-item-content {
        position: relative;
        top: -7.001px;
        margin: 0 0 0 26px;
        word-break: break-word;
    }

    .apsara-timeline-item-head {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #fff;
        border: 2px solid transparent;
        border-radius: 100px;
    }

    margin-left: 16px;

    .apsara-collapse-borderless {
        background-color: white;
    }

    .apsara-timeline {
        position: relative;
        left: 10px;
    }

    .apsara-timeline-item-tail {
        border-left: 1px dashed rgb(76, 76, 76);
    }

    .apsara-timeline-item-head-black {
        border: 1px solid #4c4c4c !important;
    }

    .apsara-timeline-item-content {
        margin-left: 24px;
    }

    .diff-timeline__date-header {
        padding: 8px 0px 8px 0px;
        font-size: 16px;
    }

    .diff-timeline__empty {
        padding: 0px;

        .apsara-timeline-item-head-custom {
            display: none;
        }

        .apsara-timeline-item-tail {
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

export const CollapsibleHeader = styled.div`
    font-size: ${({ theme }) => theme?.fontSizes[1]};
    color: ${({ theme }) => theme?.segments?.title};
    letter-spacing: 0.3px;
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 12px 16px;
`;

export const CollapsibleContent = styled(Collapsible.CollapsibleContent)`
    padding: 4px 16px 16px 16px;
`;
