import styled from 'styled-components';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

export const StyledRadioItem = styled(RadioGroupPrimitive.Item)`
    all: unset;
    background-color: white;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    box-shadow: 0 2px 10px ${({theme})=>theme?.radio?.shadow};
    &:hover {
         background-color: ${({theme})=>theme?.radio?.hover};
    }
    &:focus {
         box-shadow: 0 0 0 1px ${({theme})=>theme?.radio?.focus};
    }
    &[data-disabled] {
        background-color: ${({theme})=>theme?.radio?.disabled};
        cursor: not-allowed;
    }
`

export const StyledIndicator = styled(RadioGroupPrimitive.Indicator)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    &::after {
        content: "";
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background-color: ${({theme})=>theme?.radio?.focus};
    }
`

export const RadioGroup = styled(RadioGroupPrimitive.Root)`
    box-sizing: border-box;
    flex-wrap: wrap;
    display : flex;
    flex-direction: ${({orientation})=>orientation==="vertical"?'column':'row'}
`;

export const Label = styled('label')`
    color: ${({theme})=>theme?.radio?.label};
    margin:${({dir})=>dir==='rtl'&&'10px'};
    font-size: 15px;
    line-height: 1px;
    user-select: none;
    padding-left: 15px;
`

export const Flex = styled('div')`
    display: flex;
    margin: 10px ${({dir})=>dir==='rtl'?'0px':'10px'};
    align-items: center;
`





