import React from "react";
import { Tooltip } from "antd";

import Icon from "./Icon";
import Colors from "../Colors";
import * as customIcons from "./customicons";

export default {
    title: "General/Icons",
    component: Icon,
};

export const all = () => (
    <>
        {Object.keys(customIcons).map((name) => (
            <Tooltip placement="bottom" title={name} key={name}>
                <Icon name={name} size={48} />
            </Tooltip>
        ))}
    </>
);
export const withColors = () => (
    <>
        <Tooltip placement="bottom" title={"stop"}>
            <Icon name="stop" styleOverride={{ color: Colors.Black[800] }} />
        </Tooltip>
        <Tooltip placement="bottom" title={"doc"}>
            <Icon name="doc" styleOverride={{ color: Colors.Blue[400] }} />
        </Tooltip>
        <Tooltip placement="bottom" title={"running"}>
            <Icon name="running" styleOverride={{ color: Colors.Blue[300] }} />
        </Tooltip>
        <Tooltip placement="bottom" title={"rocket"}>
            <Icon name="rocket" styleOverride={{ color: Colors.Green[300] }} />
        </Tooltip>
        <Tooltip placement="bottom" title={"checkcircle"}>
            <Icon name="checkcircle" styleOverride={{ color: Colors.Green[300] }} />
        </Tooltip>
        <Tooltip placement="bottom" title={"block"}>
            <Icon name="block" styleOverride={{ color: Colors.Red[400] }} />
        </Tooltip>
    </>
);
