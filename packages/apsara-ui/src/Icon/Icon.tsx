import React from "react";
import Icon from "@ant-design/icons";
import Colors from "../Colors";
// @ts-ignore
import * as Icons from "@odpf/icons";

export type IconName = string;
export interface CustomIconProps {
    name: IconName;
    className?: string;
    active?: boolean;
    size?: number;
    styleOverride?: any;
    disabled?: boolean;
    onClick?: () => void;
    color?: string;
}
function CustomIcon({
    name,
    className = "",
    active = false,
    size = 24,
    color = "",
    onClick = () => null,
    styleOverride = {},
    ...restProps
}: CustomIconProps) {
    if (!name) return null;
    const iconComponent = Icons[name];
    return (
        <Icon
            className={`skeleton-icon ${name} ${className}`}
            component={iconComponent}
            style={{
                color: color ? color : !active ? Colors.black[400] : Colors.primary[300],
                fill: color ? color : Colors.primary[300],
                fontSize: `${size}px`,
                ...styleOverride,
            }}
            onClick={onClick}
            {...restProps}
        />
    );
}

export const CustomIconImage = ({ name }: { name: string }) => {
    if (!name) return null;
    const iconComponent = Icons[name];
    return <img alt={name} className={`skeleton-icon-image ${name}`} src={iconComponent} />;
};

export default CustomIcon;
