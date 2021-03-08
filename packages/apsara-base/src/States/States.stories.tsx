import React from "react";
import { Button } from "antd";
import States from "./States";

export default {
    title: "Feedback/States",
    component: States,
};

export const ErrorState = () => (
    <div style={{ minHeight: "500px" }}>
        <States
            type="error"
            title={"Oops! Something went wrong"}
            subTitle={"There is a problem with this feedback"}
            onClick={() => null}
        />
    </div>
);

export const UnknownState = () => (
    <div style={{ minHeight: "500px" }}>
        <States
            type="unknown"
            extra={
                <Button onClick={() => null} type="primary">
                    Go to Home
                </Button>
            }
        />
    </div>
);
