import React, { useState } from "react";
import { SelectProps } from "rc-select";

import Combobox from "./Combobox";

export default {
    title: "General/Combobox",
    component: Combobox,
    argTypes: { mode: { control: "select", options: ["multiple", "tags", "combobox", undefined] } },
};


type SelectOptionType = SelectProps['options'];
const options: SelectOptionType = [
    { value: "2", label: "pilotdata-integration:bq_smoke_test_json_insert_all_dataset - Bigquery Dataset" },
    { value: "3", label: "Ford Raptor" },
    { value: "4", label: "Ferrari Testarossa" },
    { value: "5", label: "Porsche 911 Carrera" },
    { value: "6", label: "Jensen Interceptor" },
    { value: "7", label: "Lamborghini Huracán" },
    { value: "8", label: "Ferrari 812 Superfast" },
    { value: "9", label: "Jeep Gladiator" },
    { value: "10", label: "Land Rover Defender" },
    { value: "11", label: "Rolls-Royce Wraith" },
    { value: "12", label: "Suzuki Samurai" },
];

const Template = (args: SelectProps) => <Combobox {...args} />;

export const MultiSelectWithSearch = Template.bind({});
MultiSelectWithSearch.args = {
    placeholder: "Please Select",
    options: options,
    allowClear: true,
    showSearch: true,
    showArrow: true,
    mode: "multiple",
    optionFilterProp: "label",
};

export const WithAsyncOptions = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [opts, setOpts] = useState<SelectOptionType>();
    
    const search = (q: string) => {
        setIsSearching(true);
        setOpts(undefined);
        setTimeout(() => {
            setOpts(options.filter((o) => (o.label as string).includes(q)))
            setIsSearching(false);
        }, 1000);
    }

    return <Combobox
        options={opts}
        allowClear
        optionFilterProp="label"
        onSearch={search}
        loading={isSearching}
    />
};
