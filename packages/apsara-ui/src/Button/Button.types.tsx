import * as React from "react";
import { CustomIconProps, IconName } from "../Icon/Icon";

const ButtonTypes = ["default", "primary", "ghost", "dashed", "link", "text"] as const;
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = ["default", "circle", "round"] as const;
export type ButtonShape = typeof ButtonShapes[number];
export type SizeType = "small" | "middle" | "large" | undefined;
const ButtonHTMLTypes = ["submit", "button", "reset"] as const;
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];
export interface BaseButtonProps {
    type?: ButtonType;
    icon?: React.ReactNode;
    /**
     * Shape of Button
     *
     * @default default
     */
    shape?: ButtonShape;
    size?: SizeType;
    disabled?: boolean;
    loading?: boolean | { delay?: number };
    prefixCls?: string;
    className?: string;
    ghost?: boolean;
    danger?: boolean;
    block?: boolean;
    children?: React.ReactNode;
}
export type AnchorButtonProps = {
    href: string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<any>, "type" | "onClick">;

export type NativeButtonProps = {
    htmlType?: ButtonHTMLType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
    Omit<React.ButtonHTMLAttributes<any>, "type" | "onClick">;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

export type TooltipPlacement =
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";

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
    href?: string;
};
