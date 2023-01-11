import React, { ReactNode } from "react";
import type { InputNumberProps as RcInputNumberProps } from "rc-input-number";
import RcInputNumber from "rc-input-number";
import type { ValueType } from "@rc-component/mini-decimal";
import { CaretUpIcon, CaretDownIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { StyledRcInputNumberWrapper } from "./InputNumber.styles";

export type DisabledType = true | false | undefined;
const DisabledContext = React.createContext<DisabledType>(false);
const InputStatuses = ["warning", "error", ""] as const;
export type InputStatus = typeof InputStatuses[number];
export type SizeType = "small" | "middle" | "large" | undefined;
const SizeContext = React.createContext<SizeType>(undefined);
export interface InputNumberProps<T extends ValueType = ValueType>
    extends Omit<RcInputNumberProps<T>, "size" | "controls"> {
    size?: SizeType;
    disabled?: boolean;
    bordered?: boolean;
    status?: InputStatus;
    controls?: boolean | { upIcon?: React.ReactNode; downIcon?: React.ReactNode };
}
const ValidateStatuses = ["success", "warning", "error", "validating", ""] as const;
export type ValidateStatus = typeof ValidateStatuses[number];
export interface FormItemStatusContextProps {
    isFormItemInput?: boolean;
    status?: ValidateStatus;
    hasFeedback?: boolean;
    feedbackIcon?: ReactNode;
}
export function getStatusClassNames(prefixCls: string, status?: ValidateStatus, hasFeedback?: boolean) {
    return classNames({
        [`${prefixCls}-status-success`]: status === "success",
        [`${prefixCls}-status-warning`]: status === "warning",
        [`${prefixCls}-status-error`]: status === "error",
        [`${prefixCls}-status-validating`]: status === "validating",
        [`${prefixCls}-has-feedback`]: hasFeedback,
    });
}
export const FormItemInputContext = React.createContext<FormItemStatusContextProps>({});
export const getMergedStatus = (contextStatus?: ValidateStatus, customStatus?: InputStatus) =>
    customStatus || contextStatus;
const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const size = React.useContext(SizeContext);

    React.useImperativeHandle(ref, () => inputRef.current!);
    const {
        className,
        size: customizeSize,
        disabled: customDisabled,
        bordered = true,
        readOnly,
        status: customStatus,
        controls,
        ...others
    } = props;
    const prefixCls = "apsara-input-number";
    const mergeSize = customizeSize || size;
    const { status: contextStatus, isFormItemInput } = React.useContext(FormItemInputContext);
    const mergedStatus = getMergedStatus(contextStatus, customStatus);
    const inputNumberClass = classNames(
        {
            [`${prefixCls}-lg`]: mergeSize === "large",
            [`${prefixCls}-sm`]: mergeSize === "small",
            [`${prefixCls}-rtl`]: "rtl" === "rtl",
            [`${prefixCls}-borderless`]: !bordered,
            [`${prefixCls}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(prefixCls, mergedStatus),
        className,
    );
    let upIcon = (
        <span className={`${prefixCls}-handler-up-inner`}>
            <CaretUpIcon />
        </span>
    );
    let downIcon = (
        <span className={`${prefixCls}-handler-down-inner`}>
            <CaretDownIcon />
        </span>
    );
    const controlsTemp = typeof controls === "boolean" ? controls : undefined;
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;
    if (typeof controls === "object") {
        upIcon =
            typeof controls.upIcon === "undefined" ? (
                upIcon
            ) : (
                <span className={`${prefixCls}-handler-up-inner`}>{controls.upIcon}</span>
            );
        downIcon =
            typeof controls.downIcon === "undefined" ? (
                downIcon
            ) : (
                <span className={`${prefixCls}-handler-down-inner`}>{controls.downIcon}</span>
            );
    }
    const element = (
        <StyledRcInputNumberWrapper>
            <RcInputNumber
                ref={inputRef}
                disabled={mergedDisabled}
                className={inputNumberClass}
                upHandler={upIcon}
                downHandler={downIcon}
                prefixCls={prefixCls}
                readOnly={readOnly}
                controls={controlsTemp}
                {...others}
            />
        </StyledRcInputNumberWrapper>
    );
    return element;
});

export default InputNumber;
