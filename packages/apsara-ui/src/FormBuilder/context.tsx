import React from "react";
import type { FormLabelAlign, ColProps, RequiredMark, ValidateStatus } from "./interface";
import type { FormInstance } from "rc-field-form";
import { FormProvider as RcFormProvider } from "rc-field-form";
import type { FormProviderProps as RcFormProviderProps } from "rc-field-form/lib/FormContext";

// export interface FormContextProps {
//   vertical: boolean;
//   name?: string;
//   colon?: boolean;
//   labelAlign?: FormLabelAlign;
//   labelWrap?: boolean;
//   labelCol?: ColProps;
//   wrapperCol?: ColProps;
//   requiredMark?: RequiredMark;
//   // itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
//   form?: FormInstance;
// }

// export const FormContext = React.createContext<FormContextProps>({
//   labelAlign: 'right',
//   vertical: false
// });

export interface FormContextProps {
    vertical: boolean;
    name?: string;
    colon?: boolean;
    labelAlign?: FormLabelAlign;
    labelCol?: ColProps;
    wrapperCol?: ColProps;
    requiredMark?: RequiredMark;
    form?: FormInstance;
    itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
}

export const FormContext = React.createContext<FormContextProps>({
    labelAlign: "right",
    vertical: false,
    itemRef: (() => {}) as any, // eslint-disable-line
});

/** Form Provider */
export interface FormProviderProps extends Omit<RcFormProviderProps, "validateMessages"> {
    prefixCls?: string;
}

export const FormProvider: React.FC<FormProviderProps> = (props) => {
    const { ...providerProps } = props;
    return <RcFormProvider {...providerProps} />;
};

export interface FormItemPrefixContextProps {
    prefixCls: string;
    status?: ValidateStatus;
}

export const FormItemPrefixContext = React.createContext<FormItemPrefixContextProps>({
    prefixCls: "",
});

export interface FormItemContextProps {
    updateItemErrors: (name: string, errors: string[], originName?: string) => void;
}

export const FormItemContext = React.createContext<FormItemContextProps>({
    updateItemErrors: () => {}, // eslint-disable-line
});
