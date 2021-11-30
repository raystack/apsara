import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import Icon from "@ant-design/icons";
import * as Icons from "@odpf/icons";

export type IconName = keyof typeof Icons;
export interface CustomIconProps {
    name?: IconName;
    className?: string;
    active?: boolean;
    size?: number;
    styleOverride?: any;
    disabled?: boolean;
    onClick?: () => void;
    color?: string;
}
function CustomIcon({
    name = "placeholder",
    className = "",
    active = false,
    size = 24,
    color = "",
    onClick = () => null,
    styleOverride = {},
    ...restProps
}: CustomIconProps) {
    const theme = useContext(ThemeContext);
    if (!name) return null;
    const iconComponent = Icons[name];
    const defaultColor = !active ? theme?.colors?.black[8] : theme?.colors?.primary[3];
    const defaultFill = theme?.colors?.primary[3];
    return (
        <Icon
            className={`skeleton-icon ${name} ${className}`}
            component={iconComponent}
            style={{
                color: color || defaultColor,
                fill: color || defaultFill,
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
