import React from "react";
import Tooltip, { TooltipProps } from "./Tooltip";

export default {
    title: "Feedback/Tooltip",
    component: Tooltip,
};

const Template = (args: TooltipProps) => <Tooltip {...args}>Tooltip</Tooltip>;
export const tooltip = Template.bind({});
tooltip.args = {
    title: "tooltip",
    placement: "right",
};
