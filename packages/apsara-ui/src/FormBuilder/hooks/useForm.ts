import * as React from "react";
import { useForm as useRcForm, FormInstance as RcFormInstance } from "rc-field-form";
import { toArray } from "../utils/field";
import { InternalNamePath, NamePath } from "rc-field-form/lib/interface";

export interface FormInstance<Values = any> extends RcFormInstance<Values> {
    /** This is an internal usage. Do not use in your prod */
    __INTERNAL__: {
        /** No! Do not use this in your code! */
        name?: string;
        /** No! Do not use this in your code! */
        itemRef: (name: InternalNamePath) => (node: React.ReactElement) => void;
    };
}

function toNamePathStr(name: NamePath) {
    const namePath = toArray(name);
    return namePath.join("_");
}

export default function useForm<Values = any>(form?: FormInstance<Values>): [FormInstance<Values>] {
    const [rcForm] = useRcForm();
    const itemsRef = React.useRef<Record<string, React.ReactElement>>({});

    const wrapForm: FormInstance<Values> = React.useMemo(
        () =>
            form ?? {
                ...rcForm,
                __INTERNAL__: {
                    itemRef: (name: InternalNamePath) => (node: React.ReactElement) => {
                        const namePathStr = toNamePathStr(name);
                        if (node) {
                            itemsRef.current[namePathStr] = node;
                        } else {
                            delete itemsRef.current[namePathStr];
                        }
                    },
                },
            },
        [form, rcForm],
    );
    return [wrapForm];
}
