import React from "react";
import Button from "../Button";
import { showSuccess, showError, showNotification } from "./Notification";
import Icon from "../Icon";

export default {
    title: "Feedback/Notifications",
};

export const notifications = () => {
    const handleSuccessClick = () => {
        showSuccess("Success", "This is test");
    };
    const handleErrorClick = () => {
        showError("Error", "This is test");
    };
    const handleCustomClick = () => {
        showNotification({
            title: "Alerts Configured",
            icon: <Icon name="copy2" />,
            content:
                "When you offer to subscribe to browser notifications for your users, it is very important to do so delicately and preferably in two steps.",
            footer: (
                <div style={{ display: "flex" }}>
                    <Button type="barebone" iconName="copy2">
                        Button 1
                    </Button>
                    <Button type="barebone" iconName="copy2">
                        Button 2
                    </Button>
                </div>
            ),
        });
    };
    return (
        <>
            <Button onClick={handleSuccessClick}>show Success</Button>
            <Button onClick={handleErrorClick}>show Error</Button>
            <Button onClick={handleCustomClick}>custom notification with action</Button>
        </>
    );
};
