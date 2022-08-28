/* eslint-disable react/display-name */
import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
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

const CrossIcon = <Icon name="cross" />;

interface NotificationProps {
    title: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
    id?: string;
}

export interface NotificationRef {
    showNotification: (toast: NotificationProps) => void;
    showSuccess: (title: string, content?: string) => void;
    showError: (title: string, content?: string) => void;
}

const uuid = () => {
    let dt = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
};

const defaultIcon = <Icon name="checkcircle" color="green" size={32} />;

export const ShowNotification = forwardRef((_, ref?: Ref<NotificationRef | undefined>) => {
    const [toasts, setToasts] = useState<NotificationProps[]>([]);

    useImperativeHandle(ref, () => ({
        showNotification(toast: NotificationProps) {
            setToasts([...toasts, { ...toast, id: uuid() }]);
        },

        showSuccess(title: string, content?: string) {
            setToasts([
                ...toasts,
                {
                    title: title,
                    content: content,
                    id: uuid(),
                    icon: <Icon name="checkcircle" color="green" size={32} />,
                },
            ]);
        },

        showError(title: string, content?: string) {
            setToasts([
                ...toasts,
                {
                    title: title,
                    content: content,
                    id: uuid(),
                    icon: <Icon name="error" color="red" size={32} />,
                },
            ]);
        },
    }));

    return (
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
                            {CrossIcon}
                        </ToastAction>
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
});
