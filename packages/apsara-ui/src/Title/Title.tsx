import React from "react";
import Tooltip from "../Tooltip";
import Text from "../Text";
import Icon, { CustomIconProps } from "../Icon/Icon";
import { Wrapper, StatusInfo } from "./Title.styles";

interface TitleProps {
    title: string;
    iconProps?: CustomIconProps;
    styleOverride?: Record<string, unknown>;
    iconToolTipText?: string;
    status?: string;
}

const Title = ({ title, iconProps, styleOverride = {}, iconToolTipText = "", status = "" }: TitleProps) => {
    return (
        <Wrapper style={styleOverride}>
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
            <StatusInfo size={12}>{status}</StatusInfo>
        </Wrapper>
    );
};

export default Title;
