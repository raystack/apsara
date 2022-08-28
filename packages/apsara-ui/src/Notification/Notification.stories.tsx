import Button from "../Button";
import React, { useRef } from "react";
import Icon from "../Icon";
import { NotificationRef, ShowNotification } from "./Notification";

export default {
    title: "Feedback/Notifications",
    component: ShowNotification,
};

export const notifications = () => {
    const toastRef = useRef<NotificationRef>();
    return (
        <div style={{ display: "flex" }}>
            <Button
                onClick={() => {
                    toastRef?.current?.showSuccess("Success", "this is a test");
                }}
            >
                show Success
            </Button>
            <Button
                onClick={() => {
                    toastRef?.current?.showError("Error", "this is a test");
                }}
            >
                show Error
            </Button>
            <Button
                onClick={() => {
                    toastRef?.current?.showNotification({
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
            <ShowNotification ref={toastRef} />
        </div>
    );
};
