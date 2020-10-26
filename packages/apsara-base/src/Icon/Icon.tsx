import React from "react";
import Icon from "@ant-design/icons";
import * as CustomIconMap from "./customicons";

interface CustomIconProps {
    name: string;
    className?: string;
    active?: boolean;
    size?: number;
    styleOverride?: any;
    disabled?: boolean;
    onClick?: () => void;
}
const CustomIcon = ({
    name,
    className = "",
    active = false,
    size = 24,
    onClick = () => null,
    styleOverride = {},
    ...restProps
}: CustomIconProps) => {
    if (!name) return null;
    const iconComponent = CustomIconMap[name];
    return (
        <Icon
            className={`skeleton-icon ${name} ${className}`}
            component={iconComponent}
            style={{
                color: !active ? "#cccc" : "#4d85f4",
                fill: "#4d85f4",
                fontSize: `${size}px`,
                ...styleOverride,
            }}
            onClick={onClick}
            {...restProps}
        />
    );
};

export const CustomIconImage = ({ name }: { name: string }) => {
    if (!name) return null;
    const iconComponent = CustomIconMap[name];
    return <img alt={name} className={`skeleton-icon-image ${name}`} src={iconComponent} />;
};

export default CustomIcon;
