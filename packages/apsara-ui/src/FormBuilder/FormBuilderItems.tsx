import React from "react";
import * as R from "ramda";
import PropTypes from "prop-types";
import { ColProps, Form, FormInstance, FormItemProps } from "antd";
import Tooltip from "../Tooltip";
import { evaluateExpression } from "./helper";
import FormBuilderField, { Widget } from "./FormBuilderField";
import { InternalNamePath, Rule } from "rc-field-form/lib/interface";

/*
Example:
const [form] = Form.useForm();
<Form form={form} onValueChange={() =>{}} />
*/

/**
 *
 * @param {object} form
 * @param {object} meta
 * form meta {fields=[{}], formItemLayout=[8,16], initialValues={}, readOnly}
 * field meta {
 *      key:
 *      name: ['name', 'first'] || string
 *      label:
 *      readOnly: False
 *      tooltip: string/ReactNode for tooltip
 *      widget,
 *      widgetType,
 *      fieldProps
 *      formItemLayout,
 *      initialValue
 *      disabled
 *      noStyle
 *      children
 *      required
 *      message
 *      placeholder,
 *      rules
 * }
 */

const shouldShow = (config: any, dependenciesFieldValue: any) => {
    if (!config.dependencies || !config.depends) return true;
    return evaluateExpression(config.depends, dependenciesFieldValue?.toString());
};

interface FormMetaFields {
    formItemLayout?: {
        labelCol: ColProps;
        wrapperCol: ColProps;
    };
    readOnly?: boolean;
    rules?: Rule[];
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    label?: string;
    patternMsg?: string;
    children?: React.ReactNode;
    className?: string;
    formItemProps?: FormItemProps;
    dependencies?: InternalNamePath[];
    disabled?: boolean;
    name: string | string[];
    widget: Widget;
    title?: string;
    fieldProps?: Record<string, unknown>;
    initialValue?: any;
    tooltip?: React.ReactNode | string;
}

export interface FormBuilderItemsProps {
    form?: FormInstance;
    meta: {
        fields?: FormMetaFields[];
        readOnly?: boolean;
        formItemLayout?: {
            labelCol: ColProps;
            wrapperCol: ColProps;
        };
    };
}
const emptyFn = () => ({});

const FormBuilderItems = (props: FormBuilderItemsProps) => {
    const { form = null, meta } = props;
    if (!meta) return null;

    const { fields = [] } = meta;

    return (
        <React.Fragment>
            {fields.map((config: FormMetaFields) => {
                // TODO: utilize form formItemLayout for all form item
                let formItemLayout = config.formItemLayout || meta.formItemLayout;

                // custom:: Get styleing for form items
                if (Array.isArray(formItemLayout) && formItemLayout.length >= 2) {
                    const [labelCol, wrapperCol] = formItemLayout;
                    formItemLayout = {
                        labelCol: { span: labelCol },
                        wrapperCol: { span: wrapperCol },
                    };
                }

                // custom:: readOnly global has more precedence than local config
                const isReadOnly = meta.readOnly || config.readOnly;

                // custom:: handle required props
                const rules = [...(config.rules || [])];
                if (config.required) {
                    rules.unshift({ required: true, message: config.message });
                }
                if (config.pattern) {
                    rules.unshift({
                        pattern: config.pattern,
                        message: `${config.label} - ${config.patternMsg}`,
                    });
                }

                //
                // custom:: TODO: handle initialValue if needed

                // FOR FORM ITEM PROPS
                const formItemProps = {
                    children: config.children,
                    rules,
                    ...(formItemLayout !== null ? formItemLayout : {}),
                    ...R.pick(
                        [
                            "name",
                            "label",
                            "lebelCol",
                            "wrapperCol",
                            "noStyle",
                            "hidden",
                            "validateStatus",
                            "hasFeedback",
                            "shouldUpdate",
                            "dependencies",
                            "initialValue",
                            "validateTrigger",
                            "help",
                            "extra",
                            "normalize",
                        ],
                        config,
                    ),
                    className: config.className,
                    ...config.formItemProps,
                };

                const dependenciesFieldsValue = R.map(form?.getFieldValue || emptyFn, config.dependencies || []);

                const shouldDisabledByFieldsValue =
                    dependenciesFieldsValue.some(R.isEmpty) || dependenciesFieldsValue.some(R.isNil);
                const isDisabled = config.disabled || shouldDisabledByFieldsValue;

                // FOR FORM FIELD PROPS
                const formFieldProps = {
                    widget: config.widget,
                    ...R.pick(
                        [
                            "value",
                            "loading",
                            "placeholder",
                            "widgetType",
                            "component",
                            "min",
                            "max",
                            "options",
                            "tooltip",
                            "viewModifier",
                            "showSearch",
                            "tokenSeparators",
                            "enableTag",
                            "mode",
                            "checked",
                            "suffix",
                            "prefix",
                            "onChange",
                            "optionLabelProp",
                            "disabledDate",
                        ],
                        config,
                    ),
                    disabled: isDisabled,
                    ...config.fieldProps,
                };
                const uniqeKey = Array.isArray(config.name) ? config.name.join(".") : config.name;

                // Don't create any form item if widget is React.Node
                // TODO: Ideally node type should be a FormBuilderItem rather than a FormBuilderField
                if (config.widget === "node") {
                    return <FormBuilderField key={uniqeKey} {...formFieldProps} />;
                }

                if (isReadOnly) {
                    return (
                        <Form.Item {...formItemProps} name={config.name} label={config.label} key={uniqeKey}>
                            {form?.getFieldValue(config.name) || config.initialValue}
                        </Form.Item>
                    );
                }

                const isTrue = (currentValue: boolean) => currentValue === true;
                const shouldShowField = R.map(
                    (dependency) => shouldShow(config, dependency),
                    dependenciesFieldsValue,
                ).every(isTrue);

                return shouldShowField ? (
                    <Form.Item {...formItemProps} name={config.name} label={config.label} key={uniqeKey}>
                        <FormBuilderToolTip form={form} title={config.title} {...formFieldProps} />
                    </Form.Item>
                ) : null;
            })}
        </React.Fragment>
    );
};

export const FormBuilderToolTip = ({ placement = "rightTop", tooltip, children, ...props }: any) => {
    const renderFormItem = (
        <div className="custom-form-field">
            <FormBuilderField {...props} />
            {children}
        </div>
    );

    return tooltip ? (
        <Tooltip title={tooltip} placement={placement}>
            {renderFormItem}
        </Tooltip>
    ) : (
        renderFormItem
    );
};

FormBuilderItems.defaultProps = {
    form: null,
};
FormBuilderItems.propTypes = {
    meta: PropTypes.shape({
        fields: PropTypes.arrayOf(
            PropTypes.shape({
                depends: PropTypes.shape({
                    operator: PropTypes.oneOf(["NotEq", "Eq"]),
                }),
            }),
        ),
    }),
};
export default FormBuilderItems;
