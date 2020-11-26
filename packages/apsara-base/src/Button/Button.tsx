import { Button as AntButton, Tooltip } from "antd";
import { NativeButtonProps } from "antd/lib/button/button";
import * as React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import Icon from "../Icon";
import "./style.less";

const Button: React.FC<NativeButtonProps> = styled(AntButton)`
    // custom-props
`;

interface CustomButtonProps {
    className?: string;
    tooltipMessage?: string;
    tooltipPlacement?:
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight"
        | "leftTop"
        | "leftBottom"
        | "rightTop"
        | "rightBottom";
    type?: "link" | "text" | "default" | "primary" | "ghost" | "dashed" | "barebone";
    styleOverride?: Record<string, string>;
    loading?: boolean;
    disabled?: boolean;
    iconName?: string;
    iconSize?: number;
    children?: React.ReactNode;
}

const CustomButton = ({
    className = "",
    tooltipMessage = "",
    tooltipPlacement = "bottom",
    type = "default",
    styleOverride = {},
    loading = false,
    disabled = false,
    iconName,
    iconSize = 24,
    children,
    ...props
}: CustomButtonProps) => {
    const IconComponent = () => {
        // ? --inline style is expected by antd
        if (loading) {
            // ? need to subtract 6px because antd's icon has no padding while our icon has.
            const loadingIconSize = `calc(${iconSize}px - 6px)`;
            return (
                <LoadingOutlined style={{ fontSize: loadingIconSize, height: loadingIconSize, marginRight: "2px" }} />
            );
        }
        return iconName ? (
            <Icon size={iconSize} name={iconName} styleOverride={styleOverride} active={!disabled} />
        ) : null;
    };

    return tooltipMessage || type === "barebone" ? (
        <Tooltip placement={tooltipPlacement} title={tooltipMessage}>
            <Button disabled={disabled} className={`skeleton-btn ${className} ${type}`} {...props}>
                <IconComponent />
                {children}
            </Button>
        </Tooltip>
    ) : (
        <Button disabled={disabled} className={className} type={type} {...props}>
            <IconComponent />
            {children}
        </Button>
    );
};

export default CustomButton;
