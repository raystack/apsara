import * as React from "react";
import { useMemo } from "react";
import classNames from "classnames";
import { List } from "rc-field-form";
import { FormProps as RcFormProps } from "rc-field-form/lib/Form";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ColProps } from "./grid/col";
import { FormContext, FormContextProps } from "./context";
import { FormLabelAlign } from "./interface";
import useForm, { FormInstance } from "./hooks/useForm";
import SizeContext, { SizeType, SizeContextProvider } from "./SizeContext";
import { StyledFieldForm } from "./FormBuilder.styles";

export type RequiredMark = boolean | "optional";
export type FormLayout = "horizontal" | "inline" | "vertical";

const validateMessages = {
    required: "${label} is required!",
};

export interface FormProps<Values = any> extends Omit<RcFormProps<Values>, "form"> {
    prefixCls?: string;
    colon?: boolean;
    name?: string;
    layout?: FormLayout;
    labelAlign?: FormLabelAlign;
    labelCol?: ColProps;
    wrapperCol?: ColProps;
    form?: FormInstance<Values>;
    size?: SizeType;
    requiredMark?: RequiredMark;
}

const InternalForm: React.ForwardRefRenderFunction<FormInstance, FormProps> = (props, ref) => {
    const contextSize = React.useContext(SizeContext);

    const {
        className = "",
        size = contextSize,
        form,
        colon,
        labelAlign,
        labelCol,
        wrapperCol,
        layout = "horizontal",
        requiredMark,
        onFinishFailed,
        name,
        ...restFormProps
    } = props;

    const mergedRequiredMark = useMemo(() => {
        if (requiredMark !== undefined) {
            return requiredMark;
        }
        return false;
    }, [requiredMark]);

    const prefixCls = "custom-form";

    const formClassName = classNames(
        prefixCls,
        {
            [`${prefixCls}-${layout}`]: true,
            [`${prefixCls}-hide-required-mark`]: mergedRequiredMark === false,
            [`${prefixCls}-${size}`]: size,
        },
        className,
    );

    const [wrapForm] = useForm(form);
    const { __INTERNAL__ } = wrapForm;
    __INTERNAL__.name = name;

    const formContextValue = useMemo<FormContextProps>(
        () => ({
            name,
            labelAlign,
            labelCol,
            wrapperCol,
            vertical: layout === "vertical",
            colon,
            requiredMark: mergedRequiredMark,
            itemRef: __INTERNAL__.itemRef,
        }),
        [name, labelAlign, labelCol, wrapperCol, layout, colon, mergedRequiredMark],
    );

    React.useImperativeHandle(ref, () => wrapForm);

    const onInternalFinishFailed = (errorInfo: ValidateErrorEntity) => {
        onFinishFailed?.(errorInfo);
    };

    return (
        <SizeContextProvider size={size}>
            <FormContext.Provider value={formContextValue}>
                <StyledFieldForm
                    id={name}
                    {...restFormProps}
                    name={name}
                    onFinishFailed={onInternalFinishFailed}
                    form={wrapForm}
                    className={formClassName}
                    validateMessages={validateMessages}
                />
            </FormContext.Provider>
        </SizeContextProvider>
    );
};

const Form = React.forwardRef<FormInstance, FormProps>(InternalForm) as <Values = any>(
    props: React.PropsWithChildren<FormProps<Values>> & { ref?: React.Ref<FormInstance<Values>> },
) => React.ReactElement;

export { useForm, List, FormInstance };

export default Form;
