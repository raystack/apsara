import React from 'react'
import Combobox from "./Combobox";
import {SelectProps} from 'rc-select';


export default {
    title: "General/Combobox",
    component: Combobox,
    argTypes: {mode: {control:'select', options :['multiple','tags', 'combobox', undefined]}}
};

const options = [
    {value:"2",label:"Lamborghini Diablo"},
    {value:"3",label:"Ford Raptor"},
    {value:"4",label:"Ferrari Testarossa"},
    {value:"5",label:"Porsche 911 Carrera"},
    {value:"6",label:"Jensen Interceptor"},
    {value:"7",label:"Lamborghini Huracán"},
    {value:"8",label:"Ferrari 812 Superfast"},
    {value:"9",label:"Jeep Gladiator"},
    {value:"10",label:"Land Rover Defender"},
    {value:"11",label:"Rolls-Royce Wraith"},
    {value:"12",label:"Suzuki Samurai"},
]

const Template = (args : SelectProps) => <Combobox {...args}/>

export const MultiSelectWithSearch = Template.bind({})

MultiSelectWithSearch.args = {
    placeholder: "Please Select",
    options: options,
    allowClear: true,
    showSearch: true,
    showArrow: true,
    mode:"multiple"
}

