import { ButtonProps } from "antd/lib/button";
import * as React from "react";
import { TooltipPlacement } from "antd/lib/tooltip";
import { CustomIconProps, IconName } from "../Icon/Icon";

export type CustomButtonProps = Omit<ButtonProps, "type"> & {
    /**
     * Defines the type of the button. It affects the button color
     *
     * @default secondary
     */
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default" | "barebone";

    /**
     * Set the loading status of button
     * @default false
     */
    loading?: boolean | { delay?: number };
    iconProps?: CustomIconProps;
    tooltipProps?: {
        message?: React.ReactNode;
        placement?: TooltipPlacement;
    };
    /**
     * @deprecated use `iconProps={{styleOverride: {}}}`
     */
    styleOverride?: React.CSSProperties;
    /**
     * @deprecated use `iconProps={{name: "name"}}`
     */
    iconName?: IconName;
    /**
     * @deprecated use `iconProps={{size: size}}`
     */
    iconSize?: number;
    size?: string | "small" | "middle" | "large";
    /**
     * Sets the handler to handle `click` event
     */
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};
