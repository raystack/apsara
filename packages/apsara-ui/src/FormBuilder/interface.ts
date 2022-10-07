import * as React from "react";
export type FormLabelAlign = "left" | "right";
export type FormLayout = "horizontal" | "inline" | "vertical";
import type { TooltipProps } from "rc-tooltip/lib/Tooltip";
export { InternalNamePath, NamePath, Store, StoreValue } from "rc-field-form/lib/interface";

type ColSpanType = number | string;
type FlexType = number | "none" | "auto" | string;

export interface ColSize {
    flex?: FlexType;
    span?: ColSpanType;
    order?: ColSpanType;
    offset?: ColSpanType;
    push?: ColSpanType;
    pull?: ColSpanType;
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
    flex?: FlexType;
    span?: ColSpanType;
    order?: ColSpanType;
    offset?: ColSpanType;
    push?: ColSpanType;
    pull?: ColSpanType;
    xs?: ColSpanType | ColSize;
    sm?: ColSpanType | ColSize;
    md?: ColSpanType | ColSize;
    lg?: ColSpanType | ColSize;
    xl?: ColSpanType | ColSize;
    xxl?: ColSpanType | ColSize;
    prefixCls?: string;
}

export type RequiredMark = boolean | "optional";

export type WrapperTooltipProps = TooltipProps & {
    icon?: React.ReactElement;
};

export type LabelTooltipType = WrapperTooltipProps | React.ReactNode;

export interface FormItemLabelProps {
    colon?: boolean;
    htmlFor?: string;
    label?: React.ReactNode;
    labelAlign?: FormLabelAlign;
    labelCol?: ColProps;
    requiredMark?: RequiredMark;
    tooltip?: LabelTooltipType;
}

const tuple = <T extends string[]>(...args: T) => args;

const ValidateStatuses = tuple("success", "warning", "error", "validating", "");
export type ValidateStatus = typeof ValidateStatuses[number];

export interface FormItemInputProps {
    wrapperCol?: ColProps;
    extra?: React.ReactNode;
    status?: ValidateStatus;
    help?: React.ReactNode;
    fieldId?: string;
}

export interface FormItemInputProps {
    wrapperCol?: ColProps;
    extra?: React.ReactNode;
    status?: ValidateStatus;
    help?: React.ReactNode;
    fieldId?: string;
}
