import React from "react";

import Tooltip from "./Tooltip";

export default {
    title: "Feedback/Tooltip",
    component: Tooltip,
};

export const Basic = () => {
    return (
        <Tooltip title="This is tooltip content">
            <span>Content Wrapped by Tooltip</span>
        </Tooltip>
    );
};

export const WithDefaultOpen = () => {
    return (
        <Tooltip title="I am open by default" defaultOpen>
            <span>Content Wrapped by Tooltip</span>
        </Tooltip>
    );
};

export const ControlledState = () => {
    const [open, setOpen] = React.useState(true);

    return (
        // @ts-ignore
        <Tooltip title={(
            <span>
                This is tooltip content
                <span style={{ marginLeft: '8px', cursor: 'pointer'}} onClick={() => setOpen(false)}>X</span>
            </span>
        )} open={open}>
            <span>Content Wrapped by Tooltip</span>
        </Tooltip>
    );
};
