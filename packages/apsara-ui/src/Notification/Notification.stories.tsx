import React from "react";

import Button from "../Button";
import Icon from "../Icon";
import { NotificationProvider, useNotification } from "./Notification";

export default {
    title: "Feedback/Notifications",
};

export const notifications = () => {
    return (
        <NotificationProvider>
            <_Notifications />
        </NotificationProvider>
    );
};

const _Notifications = () => {
    const { showError, showNotification, showSuccess } = useNotification();

    return (
        <div style={{ display: "flex" }}>
            <Button
                onClick={() => {
                    showSuccess("Success", "this is a test");
                }}
            >
                show Success
            </Button>
            <Button
                onClick={() => {
                    showError("Error", "this is a test");
                }}
            >
                show Error
            </Button>
            <Button
                onClick={() => {
                    showNotification({
                        title: "Alerts Configured",
                        icon: <Icon name="copy2" />,
                        content:
                            "When you offer to subscribe to browser notifications for your users, it is very important to do so delicately and preferably in two steps.",
                        footer: (
                            <div style={{ display: "flex" }}>
                                <Button
                                    type="barebone"
                                    style={{ color: "#333", marginRight: "5px" }}
                                    iconProps={{ name: "copy2", color: "#333" }}
                                >
                                    Button 1
                                </Button>
                                <Button
                                    type="barebone"
                                    iconName="copy2"
                                    style={{ color: "#333" }}
                                    iconProps={{ name: "copy2", color: "#333" }}
                                >
                                    Button 2
                                </Button>
                            </div>
                        ),
                    });
                }}
            >
                custom notification with action
            </Button>
        </div>
    );
};
