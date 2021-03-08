import React from "react";
import Tooltip from "./Tooltip";

export default {
    title: "Feedback/Tooltip",
    component: Tooltip,
};

export const tooltip = () => (
    <Tooltip title="Tooltip" placement="right" visible>
        Tooltip
    </Tooltip>
);
