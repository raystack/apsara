import React, { useState } from "react";

import Input, { InputProps } from "./Input";

export default {
    title: "General/Input",
    component: Input,
};

export const inputWithPlaceholder = () => {
    const [val, setVal] = useState<string | number | readonly string[] | undefined>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };

    const args: InputProps = {
        placeholder: "input with placeholder",
        disabled: false,
        value: val,
        onChange: onChange,
    };
    return <Input {...args} />;
};

export const disabledWithPlaceholder = () => {
    const [val, setVal] = useState<string | number | readonly string[] | undefined>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };

    const args: InputProps = {
        placeholder: "disabled input with placeholder",
        disabled: true,
        value: val,
        onChange: onChange,
    };
    return <Input {...args} />;
};

export const inputWithSuffix = () => {
    const [val, setVal] = useState<string | number | readonly string[] | undefined>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };

    const args: InputProps = {
        placeholder: "input with suffix",
        disabled: false,
        size: "middle",
        allowClear: false,
        suffix: "_imt",
        value: val,
        onChange: onChange,
    };
    return <Input {...args} />;
};
