import React from "react";
import Tooltip from "../Tooltip";
import { showSuccess, showError } from "../Notification";

import Icon from "./Icon";
import Colors from "../Colors";
import * as customIcons from "./customicons";

const handleCopy = (color: string) => {
    navigator.clipboard
        .writeText(color)
        .then(() => {
            showSuccess("Copied to Clipboard");
        })
        .catch(() => {
            showError("Unable to Copy");
        });
};

export default {
    title: "General/Icons",
    component: Icon,
};

export const all = () => (
    <div style={{ maxWidth: "500px" }}>
        {Object.keys(customIcons).map((name) => (
            <Tooltip placement="bottom" title={name} key={name}>
                <Icon name={name} size={36} onClick={() => handleCopy(name)} />
            </Tooltip>
        ))}
    </div>
);
export const withColors = () => (
    <div style={{ maxWidth: "500px" }}>
        <Tooltip placement="bottom" title={"stop"}>
            <Icon
                name="stop"
                size={36}
                styleOverride={{ color: Colors.black[800] }}
                onClick={() => handleCopy("stop")}
            />
        </Tooltip>
        <Tooltip placement="bottom" title={"doc"}>
            <Icon name="doc" size={36} styleOverride={{ color: Colors.blue[400] }} onClick={() => handleCopy("doc")} />
        </Tooltip>
        <Tooltip placement="bottom" title={"running"}>
            <Icon
                name="running"
                size={36}
                styleOverride={{ color: Colors.blue[300] }}
                onClick={() => handleCopy("running")}
            />
        </Tooltip>
        <Tooltip placement="bottom" title={"rocket"}>
            <Icon
                name="rocket"
                size={36}
                styleOverride={{ color: Colors.green[300] }}
                onClick={() => handleCopy("rocket")}
            />
        </Tooltip>
        <Tooltip placement="bottom" title={"checkcircle"}>
            <Icon
                name="checkcircle"
                size={36}
                styleOverride={{ color: Colors.green[300] }}
                onClick={() => handleCopy("checkcircle")}
            />
        </Tooltip>
        <Tooltip placement="bottom" title={"block"}>
            <Icon
                name="block"
                size={36}
                styleOverride={{ color: Colors.red[400] }}
                onClick={() => handleCopy("rocblockket")}
            />
        </Tooltip>
    </div>
);
