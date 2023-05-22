import * as React from "react";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import CheckCircleFilled from "@ant-design/icons/CheckCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons/ExclamationCircleFilled";
import InfoCircleFilled from "@ant-design/icons/InfoCircleFilled";
import CloseCircleFilled from "@ant-design/icons/CloseCircleFilled";
import { replaceElement } from "../FormBuilder/utils/reactNode";
import classNames from "classnames";
import { AlertWrapper } from "./Alert.styles";

export interface AlertProps {
    type?: "success" | "info" | "warning" | "error";
    message: React.ReactNode;
    description?: React.ReactNode;
    showIcon?: boolean;
    style?: React.CSSProperties;
    className?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

const iconMapFilled = {
    success: CheckCircleFilled,
    info: InfoCircleFilled,
    error: CloseCircleFilled,
    warning: ExclamationCircleFilled,
};

const iconMapOutlined = {
    success: CheckCircleOutlined,
    info: InfoCircleOutlined,
    error: CloseCircleOutlined,
    warning: ExclamationCircleOutlined,
};

const Alert = ({ description, message, className = "", style, showIcon = false, action, ...props }: AlertProps) => {
    const [closed] = React.useState(false);

    const prefixCls = "apsara-alert";

    const getType = () => {
        const { type } = props;
        if (type !== undefined) {
            return type;
        }
        return "info";
    };

    const type = getType();

    const renderIconNode = () => {
        const { icon } = props;
        const iconType = (description ? iconMapOutlined : iconMapFilled)[type] || null;
        if (icon) {
            return replaceElement(icon, <span className={`${prefixCls}-icon`}>{icon}</span>, () => ({
                className: classNames(`${prefixCls}-icon`, {
                    [(icon as any).props.className]: (icon as any).props.className,
                }),
            }));
        }
        return React.createElement(iconType, { className: `${prefixCls}-icon` });
    };

    const isShowIcon = showIcon === undefined ? true : showIcon;

    const alertClasses = classNames(
        prefixCls,
        `${prefixCls}-${type}`,
        {
            [`${prefixCls}-with-description`]: !!description,
            [`${prefixCls}-no-icon`]: !isShowIcon,
        },
        className,
    );

    return (
        <AlertWrapper>
            <div data-show={!closed} className={classNames(alertClasses)} style={{ ...style }} role="alert">
                {isShowIcon ? renderIconNode() : null}
                <div className={`${prefixCls}-content`}>
                    <div className={`${prefixCls}-message`}>{message}</div>
                    <div className={`${prefixCls}-description`}>{description}</div>
                </div>

                {action ? <div className={`${prefixCls}-action`}>{action}</div> : null}
            </div>
        </AlertWrapper>
    );
};

export default Alert;
