import React, { createContext, useCallback, useContext, useState } from "react";

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
    showNotification: (toast: Notification) => void;
    showSuccess: (title: string, content?: string) => void;
    showError: (title: string, content?: string) => void;
}

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }: any) => {
    const [toasts, setToasts] = useState<Notification[]>([]);
    
    const showNotification = useCallback((toast: Notification) => {
        setToasts([...toasts, { ...toast, id: uuid() }]);
    }, [toasts, setToasts]);

    const showSuccess = useCallback((title: string, content?: string) => {
        setToasts([
            ...toasts,
            {
                title: title,
                content: content,
                id: uuid(),
                icon: <Icon name="checkcircle" color="green" size={32} />,
            },
        ]);
    }, [toasts, setToasts]);

    const showError = useCallback((title: string, content?: string) => {
        setToasts([
            ...toasts,
            {
                title: title,
                content: content,
                id: uuid(),
                icon: <Icon name="error" color="red" size={32} />,
            },
        ]);
    }, [toasts, setToasts]);

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                showSuccess,
                showError,
            }}
        >
            {children}
            <ToastProvider swipeDirection="right">
                {toasts.map((toast) => {
                    return (
                        <Toast
                            key={toast.id}
                            onOpenChange={() => {
                                setToasts(toasts.filter((t) => t.id !== toast.id));
                            }}
                            duration={3000}
                        >
                            <ToastTitle>
                                <IconTitleWrapper>
                                    {toast.icon || defaultIcon}
                                    {toast.title}
                                </IconTitleWrapper>
                            </ToastTitle>
                            <ToastDescription asChild>
                                <DescriptionWrapper>
                                    {toast.content}
                                    {toast.footer}
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
    showNotification: (_toast: Notification) => {},
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
