import React, { useState } from "react";

import Search, { SearchProps } from "./Search";

export default {
    title: "General/Search",
    component: Search,
};

export const withValue = () => {
    const [val, setVal] = useState<string>("12345");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };

    const args: SearchProps = {
        value: val,
        size: "middle",
    };
    return <Search {...args} value={val} onChange={onChange} />;
};

export const withoutValue = () => {
    const [val, setVal] = useState<string>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };

    const args: SearchProps = {
        value: val,
    };
    return <Search {...args} value={val} onChange={onChange} />;
};
