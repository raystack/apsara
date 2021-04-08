import React from "react";
import Tooltip from "../Tooltip";
import Text from "../Text";
import "./style.less";
import Icon, { CustomIconProps } from "../Icon/Icon";

interface TitleProps {
    title: string;
    iconProps?: CustomIconProps;
    styleOverride?: Record<string, unknown>;
    iconToolTipText?: string;
    status?: string;
}

const Title = ({ title, iconProps, styleOverride = {}, iconToolTipText = "", status = "" }: TitleProps) => {
    return (
        <div className="skeleton-title" style={styleOverride}>
            <Text size={18}> {title} </Text>
            {iconProps ? (
                iconToolTipText ? (
                    <Tooltip title={iconToolTipText} placement="right">
                        <Icon {...iconProps} />
                    </Tooltip>
                ) : (
                    <Icon {...iconProps} />
                )
            ) : null}
            <Text size={12} className="status_info">
                {status}
            </Text>
        </div>
    );
};

export default Title;
