import React from "react";
import Select from "./Select";
import { SelectProps } from "./Select";

export default {
    title : "General/Select",
    component : Select,
    argTypes : {onValueChange : {action : "changed value"}}
}

const groups = [
    {
        label :"fruits",
        items : [
            {
                value : "apple",
                displayText : "Apple"
            },
            {
                value : "banana",
                displayText : "Banana"
            },
            {
                value : "mango",
                displayText : "Mango"
            },
        ]
    },
    {
        label :"cars",
        items : [
            {
                value : "ferrari",
                displayText : "Ferrari"
            },
            {
                value : "rolls-roycs",
                displayText : "Rolla Royce",
                disabled : true
            },
            {
                value : "jaguar",
                displayText : "Jaguar"
            },
        ]
    }
]

const Template = (args : SelectProps) => <Select {...args}/>

export const SelectWithTwoGroups = Template.bind({})

SelectWithTwoGroups.args = {
    defaultValue : "apple",
    groups : groups,
}

const groups1 = [
    {
        items : [
            {
                value : "a",
                displayText : "Godata Platform Production",
            },
            {
                value : "b",
                displayText : "Godata Production Id"
            },
            {
                value : "c",
                displayText : "Gojek Production Id"
            },
            {
                value : "d",
                displayText : "Godata Integration Id"
            },
            {
                value : "e",
                displayText : "Godata Systems Integration"
            },
            {
                value : "f",
                displayText : "Gojek Integration Id"
            },
        ]
    }
    
]

export const SelectWithoutLabels = Template.bind({})

SelectWithoutLabels.args = {
    defaultValue : "a",
    groups : groups1,
}


export const SelectWithCustomStyles = Template.bind({})

SelectWithCustomStyles.args = {
    defaultValue : "a",
    groups : groups1,
    triggerProps:{
        style: {
            color: "red",
            backgroundColor : "white"
        }
    },
    itemProps:{
        className:"item",
        style:{
            color:"red"
        }
    },
    separatorProps:{
        style:{
            backgroundColor:"red"
        }
    }
}