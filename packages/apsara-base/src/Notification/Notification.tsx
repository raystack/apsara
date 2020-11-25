export { notification } from "antd";
import React from "react";
import Theme from "../../theme";
import { notification } from "antd";
import Icon from "../Icon";

const CrossIcon = <Icon name="cross" styleOverride={{ color: Theme["@datlantis-close-icon-color"] }} />;

export const showError = (title: string, content?: string) => {
    notification.error({
        message: title,
        description: content || "",
        placement: "bottomRight",
        icon: <Icon name="error" size={32} styleOverride={{ color: Theme["@red-6"] }} />,
        closeIcon: CrossIcon,
    });
};

export const showSuccess = (title: string, content?: string) => {
    notification.success({
        message: title,
        description: content,
        placement: "bottomRight",
        icon: <Icon name="checkcircle" size={32} styleOverride={{ color: Theme["@green-6"] }} />,
        closeIcon: CrossIcon,
    });
};
