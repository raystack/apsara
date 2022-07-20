import React from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import {SelectRoot, SelectTrigger, SelectValue, SelectIcon, SelectContent, SelectViewport, SelectGroup, 
    SelectItem, SelectItemText, SelectItemIndicator, SelectLabel, SelectSeparator, SelectScrollUpButton, 
    SelectScrollDownButton} from './Select.styles';

type Item = {
    value : string,
    displayText : string,
    disabled? : boolean
}
 
export type Group = {
    label? : string,
    items : Item[]
}

type StyleProps = {
    className?: string,
    style?: React.CSSProperties
}

export type SelectProps = {
    defaultValue? : string,
    value? : string,
    name? : string,
    onChange? : (value: string) => void
    groups : Group[],
    defaultOpen? : boolean,
    open? : boolean,
    onOpenChange? : (open: boolean) => void,
    triggerProps? : StyleProps,
    contentProps? : StyleProps,
    scrollButtonProps? : StyleProps,
    separatorProps? : StyleProps,
    itemProps? : StyleProps
}



const Select = ({
    defaultValue,
    value,
    name,
    onChange,
    groups,
    defaultOpen = false,
    open,
    onOpenChange,
    ...props
} : SelectProps)=>{
    
    const lastInd = groups.length-1
    return (<SelectRoot  defaultValue={defaultValue} value={value} name={name} onValueChange={onChange} 
    defaultOpen = {defaultOpen} open = {open} onOpenChange = {onOpenChange}>
                <SelectTrigger {...props.triggerProps}>
                    <SelectValue />
                    <SelectIcon>
                        <ChevronDownIcon />
                    </SelectIcon>
                </SelectTrigger>
                <SelectContent {...props.contentProps}>
                    <SelectScrollUpButton {...props.scrollButtonProps}>
                        <ChevronUpIcon />
                    </SelectScrollUpButton>
                    <SelectViewport>
                    {groups.map((group: Group, i)=>(
                    <div key ={i}>
                        <SelectGroup >
                            {group.label && <SelectLabel>{group.label}</SelectLabel>}
                            
                            {group.items.map((item: Item)=>(
                                <SelectItem key={item.value} value={item.value} disabled = {item.disabled} {...props.itemProps}>
                                    <SelectItemText>{item.displayText}</SelectItemText>
                                    <SelectItemIndicator>
                                    <CheckIcon />
                                    </SelectItemIndicator>
                                </SelectItem>
                            ))}
                        </SelectGroup>

                        {i!=lastInd && <SelectSeparator {...props.separatorProps}/>}
                    </div>
                    
                    ))}
                    </SelectViewport>
                    <SelectScrollDownButton {...props.scrollButtonProps}>
                        <ChevronDownIcon />
                    </SelectScrollDownButton>
                </SelectContent>
            </SelectRoot>)
}


export default Select;