import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import Icon from "../Icon";
import {
    Toast,
    ToastAction,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    DescriptionWrapper,
    IconTitleWrapper,
} from "./Notification.styles";

export interface Notification {
    title: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
    id?: string;
}

export interface Notifier {
    showNotification: (notification: Notification) => void;
    showSuccess: (title: string, content?: string) => void;
    showError: (title: string, content?: string) => void;
}

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback(
        (notification: Notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, { ...notification, id: uuid() }]);
        },
        [setNotifications],
    );

    const showSuccess = useCallback(
        (title: string, content?: string) => {
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                    title: title,
                    content: content,
                    id: uuid(),
                    icon: <Icon name="checkcircle" color="green" size={32} />,
                },
            ]);
        },
        [setNotifications],
    );

    const showError = useCallback(
        (title: string, content?: string) => {
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                    title: title,
                    content: content,
                    id: uuid(),
                    icon: <Icon name="error" color="red" size={32} />,
                },
            ]);
        },
        [setNotifications],
    );

    const contextValue = useMemo(
        () => ({
            showNotification,
            showSuccess,
            showError,
        }),
        [showNotification, showSuccess, showError],
    );

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <ToastProvider swipeDirection="right">
                {notifications.map((notification) => {
                    return (
                        <Toast
                            key={notification.id}
                            onOpenChange={() => {
                                setNotifications(notifications.filter((t) => t.id !== notification.id));
                            }}
                            duration={3000}
                        >
                            <ToastTitle>
                                <IconTitleWrapper>
                                    {notification.icon || defaultIcon}
                                    {notification.title}
                                </IconTitleWrapper>
                            </ToastTitle>
                            <ToastDescription asChild>
                                <DescriptionWrapper>
                                    {notification.content}
                                    {notification.footer}
                                </DescriptionWrapper>
                            </ToastDescription>
                            <ToastAction asChild altText="Goto schedule to undo">
                                <Icon name="cross" />
                            </ToastAction>
                        </Toast>
                    );
                })}
                <ToastViewport />
            </ToastProvider>
        </NotificationContext.Provider>
    );
};

const NotificationContext = createContext<Notifier>({
    showNotification: (_notification: Notification) => {},
    showSuccess: (_title: string, _content?: string) => {},
    showError: (_title: string, _content?: string) => {},
});

const uuid = () => {
    let dt = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
};

const defaultIcon = <Icon name="checkcircle" color="green" size={32} />;
