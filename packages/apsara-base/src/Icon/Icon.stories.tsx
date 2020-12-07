import React from "react";
import { Tooltip } from "antd";

import Icon from "./Icon";

export default {
    title: "General/Icons",
    component: Icon,
};

export const icons = () => (
    <>
        <Tooltip placement="bottom" title={"template"}>
            <Icon name="template" />
        </Tooltip>
        <Tooltip placement="bottom" title={"keyboard"}>
            <Icon name="keyboard" />
        </Tooltip>
        <Tooltip placement="bottom" title={"fullscreen"}>
            <Icon name="fullscreen" />
        </Tooltip>
        <Tooltip placement="bottom" title={"fullscreenexit"}>
            <Icon name="fullscreenexit" />
        </Tooltip>
        <Tooltip placement="bottom" title={"edit"}>
            <Icon name="edit" />
        </Tooltip>
    </>
);
