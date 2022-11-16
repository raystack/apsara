import React, { CSSProperties } from "react";
import { ResultProps, ResultStatusType } from "./Result";
import CustomIcon, { CustomIconProps } from "../Icon/Icon";
import { StyledResult } from "./States.styles";

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
    icon?: React.ReactNode;
    iconProps?: CustomIconProps;
}

export default function States({ type = "", icon, iconProps, ...props }: StateProps) {
    const resultIcon = icon || iconProps ? <CustomIcon {...iconProps} /> : null;
    const modifiedProps = { ...stateInfo[type], ...props, icon: resultIcon };
    return <StyledResult style={pageCenterStyle} {...modifiedProps} />;
}
