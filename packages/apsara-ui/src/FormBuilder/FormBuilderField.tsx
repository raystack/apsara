// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useMemo } from "react";
import * as R from "ramda";
import { InputNumber, Radio, Select, Switch, DatePicker } from "antd";
import Moment from "moment";

import Tag from "../Tag";
import Input from "../Input";
import { getStringValue } from "./helper";

const { Option } = Select;

export type Widget = "range" | "radio" | "select" | "textarea" | "switch" | "datepicker" | "node" | "input";

interface OptionProps {
    label: string;
    value: any;
}
interface FormBuilderFieldProps {
    id?: any;
    widget?: Widget;
    widgetType?: string;
    component?: any;
    rows?: number;
    enableTag?: boolean;
    options?: OptionProps[];
    mode?: string;
    tokenSeparators?: string[];
}

const FormBuilderField = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    widget,
    widgetType,
    component = null,
    rows,
    enableTag,

    ...props
}: FormBuilderFieldProps) => {
    if (widget === "range") return <InputNumber {...props} />;
    if (widget === "radio") {
        const options = props.options.map((option: OptionProps) => {
            return (
                <Radio key={option.label} value={getStringValue(option.value)}>
                    {option.label}
                </Radio>
            );
        });
        return (
            <Radio.Group value={getStringValue(props.value)} {...props}>
                {options}
            </Radio.Group>
        );
    }
    if (widget === "select") {
        const { options = [], ...restProps } = props;
        const sortedOptions = useMemo(() => R.sortBy(R.prop("label"))(options), [options]);
        const optionsData = sortedOptions.map(({ value, label }: OptionProps) => {
            return (
                <Option key={value} value={value}>
                    {label}
                </Option>
            );
        });
        return (
            <React.Fragment>
                <Select
                    showSearch
                    className={["multiple", "tags"].includes(props.mode) ? "skeleton-multiselect" : ""}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        const inputStr = input.toLowerCase();
                        const optionVal = option.children.toLowerCase ? option.children : option.value;
                        return optionVal.toLowerCase().includes(inputStr);
                    }}
                    tokenSeparators={props.tokenSeparators}
                    {...restProps}
                >
                    {optionsData}
                </Select>
                {enableTag && props.value && <Tag style={{ marginTop: "8px" }}>{props.value}</Tag>}
            </React.Fragment>
        );
    }
    if (widget === "textarea") {
        return <Input.TextArea size="large" rows={rows} {...props} />;
    }
    if (widget === "switch") {
        const { value, ...switchProps } = props;
        return <Switch {...switchProps} checked={value} />;
    }
    if (widget === "datepicker") {
        const { value: timestamp, ...restProps } = props;
        const momentDate = timestamp && Moment(timestamp);
        return <DatePicker {...restProps} value={momentDate} />;
    }

    // Todo: Need to move this out and make this a custom form builder item instead of node
    if (widget === "node") {
        const CustomFormBuilder = component;
        return <CustomFormBuilder {...props} />;
    }

    return <Input type={widgetType} {...props} />;
};

FormBuilderField.defaultProps = {
    rows: 6,
};

export default FormBuilderField;
