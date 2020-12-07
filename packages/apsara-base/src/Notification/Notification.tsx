export { notification } from "antd";
import React from "react";
import Theme from "../theme";
import { notification } from "antd";
import Icon from "../Icon";
import "./style.less";

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

interface NotificationProps {
    title: string;
    content?: string;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
}

export const showNotification = ({
    title = "",
    content = "",
    icon = <Icon name="checkcircle" size={32} styleOverride={{ color: Theme["@green-6"] }} />,
    footer = null,
}: NotificationProps) => {
    const description = (
        <>
            <div className="custom-notification__content">{content}</div>
            {footer}
        </>
    );
    notification.open({
        message: title,
        description,
        placement: "bottomRight",
        icon,
        closeIcon: CrossIcon,
        className: "custom-notification",
    });
};
