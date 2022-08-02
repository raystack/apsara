// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useMemo } from "react";
import * as R from "ramda";
import { InputNumber, DatePicker } from "antd";
import Moment from "moment";
import Input from "../Input";
import Radio from "../Radio";
import Select from "../Select";
import Checkbox from "../Checkbox";
import Switch from "../Switch";
import { getStringValue } from "./helper";


const { RangePicker } = DatePicker;
const { Option } = Select;
export type Widget =
    | "range"
    | "radio"
    | "select"
    | "textarea"
    | "switch"
    | "datepicker"
    | "node"
    | "input"
    | "rangepicker";

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
        if(!props.items)
        return null;
        return (
            <Radio {...props}/>
        );
    }
    if (widget === "checkbox") {
        return <Checkbox.Group value={getStringValue(props.value)} {...props} />;
    }
    if (widget === "select") {
        if(!props.groups)
        return null;
        return <Select {...props}/>
    }
    if (widget === "textarea") {
        return <Input.TextArea size="large" rows={rows} {...props} />;
    }
    if (widget === "switch") {
        return <Switch {...props} />;
    }
    if (widget === "datepicker") {
        const { value: timestamp, ...restProps } = props;
        const momentDate = timestamp && Moment(timestamp);
        return <DatePicker {...restProps} value={momentDate} />;
    }
    if (widget === "rangepicker") {
        return <RangePicker {...props} />;
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
