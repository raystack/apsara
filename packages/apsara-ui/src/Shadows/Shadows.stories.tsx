import React from "react";
import Shadows from "./Shadows";
import { showSuccess, showError } from "../Notification";

export default {
    title: "General/Shadows",
    component: Shadows,
};

const styles = {
    width: "200px",
    height: "60px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
    display: "inline-block",
};

export const shadows = () => {
    const handleCopy = (color: string) => {
        navigator.clipboard
            .writeText(color)
            .then(() => {
                showSuccess("Copied to Clipboard");
            })
            .catch(() => {
                showError("Unable to Copy");
            });
    };
    return (
        <>
            <div>
                <div style={{ ...styles, boxShadow: Shadows[10] }} onClick={() => handleCopy("Shadows[10]")} />
                <div style={{ ...styles, boxShadow: Shadows[20] }} onClick={() => handleCopy("Shadows[20]")} />
                <div style={{ ...styles, boxShadow: Shadows[30] }} onClick={() => handleCopy("Shadows[30]")} />
                <div style={{ ...styles, boxShadow: Shadows[40] }} onClick={() => handleCopy("Shadows[40]")} />
            </div>
        </>
    );
};
