import React from "react";
import { FormProvider } from "./context";
import type { FormInstance } from "rc-field-form";
import InternalForm, { FormProps, useForm } from "./Form";
import FormBuilderItems from "./FormBuilderItems";
import "./style/index.style.less";

type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
    useForm: typeof useForm;
    Items: typeof FormBuilderItems;
    Provider: typeof FormProvider;
    useForceUpdate: () => any;
}

const Form = InternalForm as FormInterface;

Form.Items = FormBuilderItems;
Form.useForm = useForm;
Form.Provider = FormProvider;

Form.useForceUpdate = () => {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    return forceUpdate;
};

export { FormInstance, FormProps };

export default Form;
