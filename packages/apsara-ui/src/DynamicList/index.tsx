import React, { useEffect } from "react";
import Icon from "../Icon";
import FormBuilder from "../FormBuilder";
import * as R from "ramda";
import { Form } from "antd";
import { Field, getFormListItemFields } from "./helper";
import { DynamicListContainer } from "./DynamicList.styles";

const FormItemDynamicList = ({ form, add, meta, remove, formListfields, addBtnText }: any) => {
    // ? We need to do this because we can't set value and initialValue for form.list items from config
    useEffect(() => {
        const metaFieldsWithValue = meta.fields.filter((metaField: { value: string }) => metaField.value);
        const formValues = form?.getFieldsValue();
        if (metaFieldsWithValue.length) {
            const fieldsToSet: Field[] = [];
            formListfields.forEach((field: Field) => {
                const listIndex = field.name;
                metaFieldsWithValue.forEach((metaField: Field) => {
                    const fieldNamepath = [meta.name[0], listIndex, ...metaField.name];
                    // ? we need to check whether path existing before setting otherwise dependencies fields value will also get set
                    if (R.hasPath(fieldNamepath, formValues)) {
                        fieldsToSet.push({
                            name: [meta.name[0], listIndex, ...metaField.name],
                            value: metaField.value,
                            initialValue: metaField.initialValue,
                        });
                    }
                });
            });
            form?.setFields(fieldsToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formListfields, form]);

    return (
        <DynamicListContainer>
            {formListfields.map((field: Field) => {
                const fields = getFormListItemFields(field.name, meta);

                return (
                    <div key={field.key} className="form-dynamic-list__item">
                        <FormBuilder.Items form={form} meta={{ ...meta, fields }} />
                        <Icon
                            className="form-dynamic-list__btn-remove"
                            name="remove"
                            active
                            onClick={() => remove(field.name)}
                        />
                    </div>
                );
            })}
            <span
                role="presentation"
                onClick={() => {
                    add();
                }}
                className="form-dynamic-list__btn-add"
            >
                <Icon name="add" active />
                {addBtnText}
            </span>
        </DynamicListContainer>
    );
};

export const DynamicList = ({ form, meta, addBtnText = "Add" }: any) => {
    return (
        <Form.List name={meta.name}>
            {(formListfields, { add, remove }) => (
                <FormItemDynamicList
                    form={form}
                    meta={meta}
                    add={add}
                    remove={remove}
                    formListfields={formListfields}
                    addBtnText={addBtnText}
                />
            )}
        </Form.List>
    );
};

export default DynamicList;
