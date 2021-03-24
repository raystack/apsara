import React from "react";
import Tooltip from "../Tooltip";
import Text from "../Text";
import "./style.less";
import Icon, { IconName } from "../Icon/Icon";

interface TitleProps {
    title: string;
    icon?: {
        name: IconName;
        color: string;
    };
    styleOverride?: Record<string, unknown>;
    iconToolTipText?: string;
    status?: string;
}

const Title = ({ title, icon, styleOverride = {}, iconToolTipText = "", status = "" }: TitleProps) => {
    return (
        <div className="skeleton-title" style={styleOverride}>
            <Text size={18}> {title} </Text>
            {icon ? (
                iconToolTipText ? (
                    <Tooltip title={iconToolTipText} placement="right">
                        <Icon name={icon.name} styleOverride={{ color: icon.color }} />
                    </Tooltip>
                ) : (
                    <Icon name={icon.name} styleOverride={{ color: icon.color }} />
                )
            ) : null}
            <Text size={12} className="status_info">
                {status}{" "}
            </Text>
        </div>
    );
};

export default Title;
