import React from "react";
import Button from "../Button";
import { showSuccess, showError } from "./Notification";

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
    return (
        <>
            <Button onClick={handleSuccessClick}>show Success</Button>
            <Button onClick={handleErrorClick}>show Error</Button>
        </>
    );
};
