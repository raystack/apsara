import { CheckIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { CheckboxWrapper, StyledCheckbox, StyledIndicator } from "./Checkbox.styles";

type CheckboxProps = {
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean | "indeterminate") => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    label?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
};

type CheckboxGroupProps = {
    defaultValue?: string[];
    value?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
    required?: boolean;
    orientation?: "horizontal" | "vertical";
    name?: string;
    options?: CheckboxProps[];
};

const Checkbox = ({
    defaultChecked = true,
    checked,
    onChange,
    disabled,
    required,
    name,
    value,
    style,
}: CheckboxProps) => {
    return (
        <StyledCheckbox
            defaultChecked={defaultChecked}
            id="c1"
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            style={style}
        >
            <StyledIndicator>
                <CheckIcon style={{ width: "13px", height: "13px" }} />
            </StyledIndicator>
        </StyledCheckbox>
    );
};

const CheckboxGroup = ({
    defaultValue,
    value,
    options,
    onChange,
    orientation = "horizontal",
    ...props
}: CheckboxGroupProps) => {
    const [selectedValues, setSelectedValues] = useState(defaultValue || value || []);

    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    const onValuesChange = (value: string, checked: boolean | "indeterminate") => {
        if (checked) return [...selectedValues, value];
        else return selectedValues.filter((selectedValue) => selectedValue !== value);
    };

    return (
        <CheckboxWrapper orientation={orientation}>
            {options &&
                options.map((option) => (
                    <div className="checkbox_label_wrapper" key={option.value}>
                        <Checkbox
                            onChange={(checked) => {
                                const newSelectedValues = onValuesChange(option.value || "", checked);
                                setSelectedValues(newSelectedValues);
                                onChange && onChange(newSelectedValues);
                            }}
                            checked={selectedValues.includes(option.value || "")}
                            value={option.value}
                            {...props}
                        />
                        <label className="checkbox_label">{option.label}</label>
                    </div>
                ))}
        </CheckboxWrapper>
    );
};

Checkbox.Group = CheckboxGroup;

export default Checkbox;
