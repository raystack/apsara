import React, { CSSProperties } from "react";
import Icon from "@ant-design/icons";
import { Result } from "antd";
import { ResultProps, ResultStatusType } from "antd/lib/result";

const pageCenterStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

interface StatesInfo {
    [name: string]: {
        icon?: string | null;
        status: ResultStatusType;
        title: string;
        subTitle?: string;
        extra?: null;
    };
}

const stateInfo: StatesInfo = {
    error: {
        icon: null,
        status: "500",
        title: "Oops! Something went wrong",
        extra: null,
    },
    unknown: {
        icon: null,
        status: "404",
        title: "The page is Unknown.",
        subTitle: "Sorry for that, but the page you are looking for doesn't exist.",
    },
    loading: {
        icon: null,
        status: "info",
        title: "Loading",
    },
    success: {
        icon: null,
        status: "success",
        title: "Success",
    },
};

interface StateProps extends ResultProps {
    type?: keyof typeof stateInfo;
    icon?: string;
    imageIcon?: React.ReactNode;
}

export default function States({ type = "", icon, imageIcon, ...props }: StateProps) {
    const modifiedProps = { ...stateInfo[type], ...props, icon: imageIcon || <Icon type={icon} /> };
    return <Result style={pageCenterStyle} {...modifiedProps} />;
}
