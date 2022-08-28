import * as React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
// import * as AC from "./Button.styles";
import { CustomButtonProps } from "./Button.types";
import { StyledButton } from "./Button.styles";

const defaultIconSize = 24;
const Button = ({
    type = "default",
    className,
    disabled = false,
    loading = false,
    tooltipProps = {
        message: "",
        placement: "bottom",
    },
    iconProps,
    styleOverride = {},
    iconName,
    iconSize = defaultIconSize,
    children,
    size = "middle",
    block = false,
    shape = "round",
    onClick = () => null,
    ...props
}: CustomButtonProps) => {
    const IconComponent = () => {
        if (loading) {
            // ? need to subtract 6px because antd's icon has no padding while our icon has.
            const loadingIconSize = `calc(${iconProps?.size || defaultIconSize}px - 6px)`;
            return (
                <LoadingOutlined style={{ fontSize: loadingIconSize, height: loadingIconSize, marginRight: "2px" }} />
            );
        }
        return iconName || iconProps ? (
            <Icon size={iconSize} name={iconName} styleOverride={styleOverride} active={!disabled} {...iconProps} />
        ) : null;
    };

    const button = (
        <StyledButton role="button" type={type} size={size} block={block} shape={shape}>
            <button
                disabled={disabled}
                onClick={(e) => {
                    onClick(e);
                }}
                className={`apsara-btn ${clsx(className, type)}`}
                {...props}
            >
                <IconComponent />
                {children}
            </button>
        </StyledButton>
    );

    return tooltipProps?.message ? (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore:next-line
        <Tooltip placement={tooltipProps?.placement} title={tooltipProps?.message}>
            <span>{button}</span>
        </Tooltip>
    ) : (
        button
    );
};

export default Button;
