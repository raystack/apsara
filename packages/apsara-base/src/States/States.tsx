// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import Icon from "@ant-design/icons";
import { Result } from "antd";

const pageCenterStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const stateInfo = {
    error: {
        icon: null,
        status: "500",
        title: "Oops! Something went wrong",
        subTitle: "",
        extra: null,
    },
    unknown: {
        icon: null,
        status: "404",
        title: "The page is Unknown.",
        subTitle: "Sorry for that, but the page you are looking for doesn't exist.",
    },
};

export default function States({ type = "error", icon, imageIcon, ...props }: any) {
    const modifiedProps = { ...stateInfo[type], ...props, icon: imageIcon || <Icon type={icon} /> };
    return <Result style={pageCenterStyle} {...modifiedProps} />;
}
