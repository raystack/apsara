import React, { CSSProperties } from "react";
import Icon from "@ant-design/icons";
import Result, { ResultProps, ExceptionStatusType } from "antd/lib/result";

const pageCenterStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

interface StatesInfo {
    [name: string]: {
        icon?: string | null;
        status: ExceptionStatusType;
        title: string;
        subTitle: string;
        extra?: null;
    };
}

const stateInfo: StatesInfo = {
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

interface StateProps extends ResultProps {
    type?: "error" | "unknown";
    icon?: string;
    imageIcon?: React.ReactNode;
}

export default function States({ type = "error", icon, imageIcon, ...props }: StateProps) {
    const modifiedProps = { ...stateInfo[type], ...props, icon: imageIcon || <Icon type={icon} /> };
    return <Result style={pageCenterStyle} {...modifiedProps} />;
}
