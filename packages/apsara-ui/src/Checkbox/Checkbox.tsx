import { CheckIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { CheckboxWrapper, CheckboxGroupWrapper, StyledCheckbox, StyledIndicator } from "./Checkbox.styles";

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
    id?: string;
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
    defaultChecked = false,
    checked,
    onChange,
    disabled,
    required,
    name,
    value,
    label,
    style,
    id = "c1",
}: CheckboxProps) => {
    const [isChecked, setIsChecked] = useState<boolean | "indeterminate">(checked || defaultChecked || false);

    useEffect(() => {
        setIsChecked(checked || false);
    }, [checked]);

    return (
        <CheckboxWrapper>
            <StyledCheckbox
                defaultChecked={defaultChecked}
                id={id}
                checked={isChecked}
                onCheckedChange={
                    onChange ||
                    function (checked) {
                        setIsChecked(checked);
                    }
                }
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
            {label && <label htmlFor={id}>{label}</label>}
        </CheckboxWrapper>
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
        setSelectedValues(defaultValue || value || []);
    }, [value, defaultValue]);

    const onValuesChange = (value: string, checked: boolean | "indeterminate") => {
        if (checked) return [...selectedValues, value];
        else return selectedValues.filter((selectedValue) => selectedValue !== value);
    };

    return (
        <CheckboxGroupWrapper orientation={orientation}>
            {options &&
                options.map((option, index) => (
                    <div className="checkbox_label_wrapper" key={option.value}>
                        <Checkbox
                            onChange={(checked) => {
                                const newSelectedValues = onValuesChange(option.value || "", checked);
                                setSelectedValues(newSelectedValues);
                                onChange && onChange(newSelectedValues);
                            }}
                            id={`c${index}`}
                            checked={selectedValues.includes(option.value || "")}
                            value={option.value}
                            {...props}
                        />
                        <label className="checkbox_label" htmlFor={`c${index}`}>
                            {option.label}
                        </label>
                    </div>
                ))}
        </CheckboxGroupWrapper>
    );
};

Checkbox.Group = CheckboxGroup;

export default Checkbox;
