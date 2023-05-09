import React, { FC, useEffect } from "react";

import FormBuilder, { Form, Field } from "./index";
import Tabs from "../Tabs";
import Button from "../Button";

export default {
    title: "Data Display/Form",
    component: FormBuilder,
};

export const Basic: FC = () => {
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
            key: "is_enabled",
            label: "Is Enabled",
            name: ["is_enabled"],
            widget: "switch",
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
        {
            key: "conditional_field",
            label: "Service Account",
            name: ["account_id"],
            dependencies: [["duration"]],
            depends: {
                operator: "NotEq",
                value: undefined,
            },
        },
    ];

    const handleSubmit = () => {
        console.log("Submitting:", form.getFieldsValue());
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

export const WithTabs = () => {
    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue({
            name: 'Test',
            hobbies: [
                { label: 'drawing', since: '2yo' },
                { label: 'cooking', since: '5yo' },
            ],
        })
    }, [])

    const onFinish = () => {
        // we need to pass `true` to form.getFieldsValue(true) to make sure we all the fields from the form
        // not passing `true` will only give you the fields that are currently rendered
        console.log('form values:', form.getFieldsValue(true))
    }

    return (
        <Form form={form} onFinish={onFinish}>
            <Tabs
                tabContent={[
                    {
                        title: 'General',
                        value: 'general_tab',
                        content: (
                            <div>
                                <Field name="name">
                                    <input placeholder="Sample Name" />
                                </Field>
                            </div>
                        ),
                    },
                    {
                        title: 'Hobbies',
                        value: 'hobby_tab',
                        content: (
                            <div>
                                <Form.List name="hobbies">
                                    {(fields) => fields.map((field) => (
                                        <>
                                            <Field name={[field.name, 'label']}>
                                                <input placeholder="Label" />
                                            </Field>
                                            <Field name={[field.name, 'since']}>
                                                <input placeholder="Since" />
                                            </Field>
                                            <br />
                                        </>
                                    ))}
                                </Form.List>
                            </div>
                        ),
                    }
                ]}
            />
            <button>Submit</button>
        </Form>

    )
}
