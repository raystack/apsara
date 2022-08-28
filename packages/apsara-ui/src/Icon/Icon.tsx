import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { IconWrapper } from "./Icon.styles";
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
    disabled = false,
}: CustomIconProps) {
    const theme = useContext(ThemeContext);
    if (!name) return null;
    const IconComponent = Icons[name];
    const defaultColor = !active ? theme?.colors?.black[8] : theme?.colors?.primary[3];
    const defaultFill = theme?.colors?.primary[3];
    const { fontSize = `${size}px`, ...restStyles } = styleOverride;
    return (
        <IconWrapper
            className={`apsara_icon skeleton-icon ${name} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                color: color || defaultColor,
                fill: color || defaultFill,
                ...restStyles,
            }}
        >
            <IconComponent style={{ width: fontSize, height: fontSize }} />
        </IconWrapper>
    );
}

export const CustomIconImage = ({ name }: { name: string }) => {
    if (!name) return null;
    const iconComponent = Icons[name];
    return <img alt={name} className={`skeleton-icon-image ${name}`} src={iconComponent} />;
};

export default CustomIcon;
