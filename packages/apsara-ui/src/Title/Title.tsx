import React from "react";
import Icon from "../Icon";
import Tooltip from "../Tooltip";
import "./style.less";

interface TitleProps {
    title: string;
    icon?: {
        name: string;
        color: string;
    };
    styleOverride?: Record<string, unknown>;
    iconToolTipText?: string;
    status?: string;
}

const Title = ({ title, icon, styleOverride = {}, iconToolTipText = "", status = "" }: TitleProps) => {
    return (
        <div className="skeleton-title" style={styleOverride}>
            <span> {title} </span>
            {icon ? (
                iconToolTipText ? (
                    <Tooltip title={iconToolTipText} placement="right">
                        <Icon name={icon.name} styleOverride={{ color: icon.color }} />
                    </Tooltip>
                ) : (
                    <Icon name={icon.name} styleOverride={{ color: icon.color }} />
                )
            ) : null}
            <span className="status_info"> {status} </span>
        </div>
    );
};

export default Title;
