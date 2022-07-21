import React from "react";
import { StyledSwitch, StyledThumb } from "./Switch.styles";

type StyleProps = {
    className?: string,
    style?: React.CSSProperties
}

export type SwitchProps = {
    defaultChecked? : boolean,
    checked? : boolean,
    onChange? : (checked: boolean) => void,
    disabled? : boolean,
    required? : boolean,
    name? : string,
    value? : string,
    color? : string,
    style? : React.CSSProperties,
    className? : string,
    thumbProps? : StyleProps
}

const Switch = ({
    defaultChecked = false,
    checked,
    onChange,
    disabled = false,
    required,
    name,
    value,
    color,
    ...props
}: SwitchProps)=> {
    return (
        <StyledSwitch defaultChecked={defaultChecked} checked={checked} onCheckedChange={onChange}
         disabled={disabled} required={required} name = {name} value = {value} style = {props.style} 
         className= {props.className} color={color}> 
            <StyledThumb {...props.thumbProps}/>
        </StyledSwitch>
    )
}

export default Switch;
