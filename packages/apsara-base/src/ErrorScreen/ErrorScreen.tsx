// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import Icon from "@ant-design/icons";
import { Result, Button } from "antd";

const pageCenterStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

export default function ErrorScreen({ error }: any) {
    return <Result style={pageCenterStyle} status="500" title="Oops! Something went wrong" subTitle={error} />;
}

const CustomErrorScreen = ({
    title = "",
    subTitle = "",
    icon = null,
    status = "",
    imageIcon = null,
    ...restProps
}: any) => {
    const resultIcon = imageIcon || <Icon type={icon} />;
    return (
        <Result
            style={pageCenterStyle}
            status={status}
            title={title}
            subTitle={subTitle}
            icon={resultIcon}
            {...restProps}
        />
    );
};

const ErrorScreen404 = ({
    onClick = () => {
        window.location.href = "/";
    },
}: any) => (
    <Result
        style={pageCenterStyle}
        status="404"
        title="The page is Unknown."
        subTitle="Sorry for that, but the page you are looking for doesn't exist."
        extra={
            <Button onClick={onClick} type="primary">
                Go to Home
            </Button>
        }
    />
);

const ErrorScreen500 = ({
    onClick = () => {
        window.location.href = "/";
    },
}: any) => (
    <Result
        style={pageCenterStyle}
        status="500"
        title="Something went wrong"
        subTitle="Sorry, we're having some technical issues. Please refresh the page to try again."
        extra={
            <Button onClick={onClick} type="primary">
                Back Home
            </Button>
        }
    />
);

export { ErrorScreen404, ErrorScreen500, CustomErrorScreen };
