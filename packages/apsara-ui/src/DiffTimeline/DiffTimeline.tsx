import React, { useState } from "react";
import moment from "moment";
import * as R from "ramda";

import { DiffTimelineContainer, DiffTableContainer, CollapsibleHeader, CollapsibleContent } from "./DiffTimeline.styles";
import Icon from "../Icon";
import * as Collapsible from "@radix-ui/react-collapsible";

const DATE_FORMAT = "DD MMMM YYYY";

const buildDiffTimelineData = (data: any) => {
    data.sort((a: any, b: any) => {
        return moment(a.createdAt) < moment(b.createdAt) ? 1 : -1;
    });
    return data.reduce((acc: any, val: any) => {
        const momentTimeObj = moment(val.createdAt);
        const dateKey = momentTimeObj.format(DATE_FORMAT);
        const time = momentTimeObj.format("LTS");
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push({ ...val, time });
        return acc;
    }, {});
};

const stringify = (str: string) => (R.is(String, str) ? str : JSON.stringify(str));

const DiffTable = ({ diff }: any) => {
    return (
        <DiffTableContainer>
            {Object.keys(diff).map((diffKey) => {
                const val = diff[diffKey];
                const isAdded = Array.isArray(val) && val.length === 1;
                const isRemoved = R.propEq(1, 0, val) && R.propEq(2, 0, val);
                const isModified = Array.isArray(val) && val.length === 2;
                let added = "",
                    deleted = "";
                if (isAdded) {
                    [added] = val;
                    deleted = "";
                }
                if (isRemoved) {
                    added = "";
                    [deleted] = val;
                }
                if (isModified) {
                    [deleted, added] = val;
                }
                added = stringify(added);
                deleted = stringify(deleted);
                return (
                    <div key={diffKey} className="diff-table__section">
                        <div
                            className={`"diff-table__header" ${isRemoved && "diff-table__text--deletion diff-table__text--strikethrough"
                                } ${isAdded && "diff-table__text--addition"}`}
                        >
                            {diffKey}
                        </div>
                        {added !== "" && (
                            <div className="diff-table__text diff-table__text--addition">
                                <span className="diff-table__sign"> + </span> {added}
                            </div>
                        )}
                        {deleted !== "" && (
                            <div className="diff-table__text diff-table__text--deletion">
                                <span className="diff-table__sign"> - </span> {deleted}
                            </div>
                        )}
                    </div>
                );
            })}
        </DiffTableContainer>
    );
};

const DiffTimelineBlock = ({ timelineBlockData }: any) => {
    const [isActive, setIsActive] = useState(false);
    return (
        <li className="apsara-timeline-item diff-timeline__block" color="black">
            <div className="apsara-timeline-item-tail"></div>
            <div className="apsara-timeline-item-head apsara-timeline-item-head-black" style={{ borderColor: 'black' }}></div>
            <div className="apsara-timeline-item-content">
                <div className="diff-timeline__reason">{timelineBlockData.reason}</div>

                <div className="diff-timeline__details">
                    <span className="diff-timeline__details-text"> {timelineBlockData.time} </span>
                    {timelineBlockData.user && (
                        <React.Fragment>
                            <span className="diff-timeline__details-dot" />
                            <span className="diff-timeline__details-text">{`by @${timelineBlockData.user}`}</span>
                        </React.Fragment>
                    )}
                </div>
                {!R.isEmpty(timelineBlockData.diff) && (
                    <Collapsible.Root open={isActive}>
                        <CollapsibleHeader onClick={() => setIsActive(!isActive)} >
                            <Icon size={12} name={isActive ? "removeOutlineBox" : "addOutlineBox"} />
                            <span style={{ paddingLeft: '10px', fontWeight: "normal", cursor: 'pointer' }}>
                                {<div> {isActive ? "Hide" : "See"} details </div>}
                            </span>
                        </CollapsibleHeader>
                        <CollapsibleContent>
                            <DiffTable diff={timelineBlockData.diff} />
                        </CollapsibleContent>
                    </Collapsible.Root>

                )}
            </div>
        </li>
    );
};

const DiffTimeline = ({ data = [] }) => {
    const parsedData = buildDiffTimelineData(data);
    const timelineDates = Object.keys(parsedData).sort((a, b) => {
        return moment(a, DATE_FORMAT) < moment(b, DATE_FORMAT) ? 1 : -1;
    });

    return (
        <DiffTimelineContainer>
            {timelineDates.map((date) => {
                return (
                    <div key={date} className="diff-timeline__date">
                        <div className="diff-timeline__date-header">
                            {date === moment().format(DATE_FORMAT) ? "Today" : date}
                        </div>
                        <ul className="apsara-timeline">
                            <li className="apsara-timeline-item diff-timeline__empty">
                                <div className="apsara-timeline-item-tail"></div>
                                <div className="apsara-timeline-item-content">
                                    <div className="diff-timeline__empty-content"></div>
                                </div>
                            </li>
                            {parsedData[date].map((timelineBlockData: any) => (
                                <DiffTimelineBlock key={timelineBlockData._id} timelineBlockData={timelineBlockData} />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </DiffTimelineContainer>
    );
};

DiffTimeline.DiffTimelineBlock = DiffTimelineBlock;
DiffTimeline.DiffTable = DiffTable;

export default DiffTimeline;
