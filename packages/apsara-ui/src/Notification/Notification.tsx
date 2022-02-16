import React from "react";
import { notification } from "antd";
import Icon from "../Icon";

const CrossIcon = <Icon name="cross" />;

export function showError(title: string, content?: string) {
    notification.error({
        message: title,
        description: content || "",
        placement: "bottomRight",
        icon: <Icon name="error" size={32} />,
        closeIcon: CrossIcon,
    });
}

export function showSuccess(title: string, content?: string) {
    notification.success({
        message: title,
        description: content,
        placement: "bottomRight",
        icon: <Icon name="checkcircle" size={32} />,
        closeIcon: CrossIcon,
    });
}

interface NotificationProps {
    title: string;
    content?: string;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
}

export function showNotification({
    title = "",
    content = "",
    icon = <Icon name="checkcircle" size={32} />,
    footer = null,
}: NotificationProps) {
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
}
