import React from "react";
import { RadioGroup, StyledRadioItem, StyledIndicator, Label, Flex } from "./Radio.styles";

type RadioItem ={
    label?: string,
    value: string,
    disabled?: boolean,
    required?: boolean
}

type styleProps={
    className?: string,
    style?: React.CSSProperties
}

export type RadioProps = {
    defaultValue?: string,
    value?: string,
    items: RadioItem[],
    onChange?: (value: string) => void,
    name?: string,
    required?: boolean,
    orientation?: "horizontal" | "vertical",
    dir?: "ltr" | "rtl",
    className?: string,
    style?: React.CSSProperties,
    itemStyle?: styleProps
}

const Radio = ({
    defaultValue,
    value,
    items,
    onChange,
    required,
    orientation,
    dir,
    ...props
}: RadioProps)=>{
    return (
    <RadioGroup defaultValue={defaultValue} value={value} onValueChange={onChange} required={required} 
     orientation={orientation} dir={dir} className={props.className} 
     style={props.style} aria-label="View density"
     >
    {items.map((item, i)=>(
        <Flex dir={dir} key={i}>
            <StyledRadioItem value={item.value} disabled={item.disabled} required={item.required} {...props.itemStyle}
                id={i.toString()}>
                <StyledIndicator />
            </StyledRadioItem>
            <Label dir={dir} htmlFor={i.toString()}>{item.label}</Label>
        </Flex>
    ))}
    </RadioGroup>
    )
}


export default Radio;