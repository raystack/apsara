import React, { FC } from "react";
import FormBuilder from "./index";
import Button from "../Button";

export default {
    title: "Data Display/Form",
    component: FormBuilder,
};

export const Form: FC = () => {
    const [form] = FormBuilder.useForm();
    const forceUpdate = FormBuilder.useForceUpdate();
    const accountTypeOptions = [
        {
            label: "User",
            value: "user",
        },
        {
            label: "Service",
            value: "service",
        },
    ];

    const sampleFields = [
        {
            key: "account_type",
            label: "Requesting For",
            name: ["account_type"],
            widget: "radio",
            fieldProps: {
                items: accountTypeOptions,
            },
            required: true,
            initialValue: "user",
        },
        {
            key: "sample_id",
            label: "Sample field",
            name: ["sample_id"],
            required: true,
        },
        {
            key: "account_id",
            label: "Service Account",
            name: ["account_id"],
            dependencies: [["sample_id"]],
            depends: {
                operator: "NotEq",
                value: undefined,
            },
            required: true,
        },
        {
            key: "duration",
            label: "Duration",
            name: ["resources", 0, "options", "duration"],
            widget: "combobox",
            options: [
                { label: "1 Day", value: "24h" },
                { label: "3 Days", value: "72h" },
            ],
            required: false,
            disabled: false,
            loading: true,
        },
    ];

    const handleSubmit = () => {
        console.log("Account Type: ", form.getFieldValue(["account_type"]));
        console.log("Sample Id: ", form.getFieldValue(["sample_id"]));
        console.log("Account Id: ", form.getFieldValue(["account_id"]));
        console.log("Duration: ", form.getFieldValue(["resources", 0, "options", "duration"]));
        console.log("All:", form.getFieldsValue());
        console.log("Submitted");
    };

    return (
        <div>
            <FormBuilder name="form" form={form} onValuesChange={forceUpdate} onFinish={handleSubmit} layout="vertical">
                <FormBuilder.Items form={form} meta={{ fields: sampleFields }} />
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </FormBuilder>
        </div>
    );
};
