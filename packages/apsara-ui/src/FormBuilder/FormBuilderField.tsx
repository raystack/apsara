// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import InputNumber from "../InputNumber";
import DatePicker from "../DatePicker";
import RangePicker from "../DatePicker/RangePicker";
import Moment from "moment";
import Input from "../Input";
import Radio from "../Radio";
import Select from "../Select";
import Checkbox from "../Checkbox";
import Switch from "../Switch";
import Combobox from "../Combobox";
import { getStringValue } from "./helper";
import Tag from "../Tag";

export type Widget =
    | "range"
    | "radio"
    | "select"
    | "textarea"
    | "switch"
    | "datepicker"
    | "node"
    | "input"
    | "rangepicker"
    | "combobox";

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
    enableTag, // eslint-disable-line
    ...props
}: FormBuilderFieldProps) => {
    if (widget === "range") return <InputNumber {...props} />;
    if (widget === "radio") {
        if (!props.items) return null;
        return <Radio {...props} />;
    }
    if (widget === "checkbox") {
        return <Checkbox.Group value={getStringValue(props.value)} {...props} />;
    }
    if (widget === "select") {
        if (!props.groups) return null;
        return <Select {...props} />;
    }
    if (widget === "combobox") {
        return (
            <React.Fragment>
                <Combobox {...props} />
                {enableTag &&
                    props.value &&
                    (props.value instanceof Array ? (
                        props.value.map((singleVal) => (
                            <Tag type="round" color="rgb(232, 239, 253)" key={singleVal} style={{ marginTop: "4px" }}>
                                {singleVal}
                            </Tag>
                        ))
                    ) : (
                        <Tag type="round" color="rgb(232, 239, 253)" style={{ marginTop: "8px" }}>
                            {props.value}
                        </Tag>
                    ))}
            </React.Fragment>
        );
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
