import React from "react";
import { ErrorScreen404 } from "./ErrorScreen";

export default {
    title: "Feedback/ErrorScreen",
    component: ErrorScreen404,
};

export const ErrorScreen = () => (
    <div style={{ minHeight: "500px" }}>
        <ErrorScreen404 onClick={() => null} />
    </div>
);
