import React from "react";
import { FormProvider } from "./context";
import InternalForm, { FormInstance, FormProps, useForm } from "./Form";
import FormBuilderItems from "./FormBuilderItems";
import Item from "./FormItem";
import PropTypes from "prop-types";
import { List, Field } from "rc-field-form";

type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
    useForm: typeof useForm;
    Item: typeof Item;
    List: typeof List;
    Provider: typeof FormProvider;
}

const Form = InternalForm as FormInterface;

Form.Item = Item;
Form.List = List;
Form.useForm = useForm;
Form.Provider = FormProvider;

const validateMessages = {
    required: "${label} is required!",
};

interface CustomFormProps extends FormProps {
    form: FormInstance;
}

const CustomForm = ({ form: inForm, ...props }: CustomFormProps) => {
    const [form] = Form.useForm(inForm);
    return <Form validateMessages={validateMessages} form={form} {...props} />;
};

CustomForm.defaultProps = {
    name: "form",
    colon: false,
    layout: "vertical",
    labelAlign: "left",
    hideRequiredMark: true,
    initialValues: {},
    scrollToFirstError: true,
};

CustomForm.propTypes = {
    name: PropTypes.string.isRequired,
    colon: PropTypes.bool,
    layout: PropTypes.oneOf(["horizontal", "inline", "vertical"]),
    labelAlign: PropTypes.oneOf(["left", "right"]),
    hideRequiredMark: PropTypes.bool,
    initialValues: PropTypes.object,
    preserve: PropTypes.bool,
    scrollToFirstError: PropTypes.bool,
};

CustomForm.Provider = Form.Provider;
CustomForm.useForm = Form.useForm;
CustomForm.Items = FormBuilderItems;

CustomForm.useForceUpdate = () => {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    return forceUpdate;
};

export { Form, FormInstance, Field };
export default CustomForm;
