import styled from 'styled-components';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export const StyledSwitch = styled(SwitchPrimitive.Root)`
    all: unset;
    width: 42px;
    height: 25px;
    background-color: ${({theme})=>theme?.switch?.bg};
    border-radius: 9999px;
    position: relative;
    box-shadow: 0 2px 10px ${({theme})=>theme?.switch?.shadow};
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    &:focus {
        box-shadow: 0 0 0 2px #d9d9d9;
    }
    &[data-state="checked"] {
        background-color: ${({color, theme})=>color? color :theme?.switch?.color};
    }
    &:hover{
        cursor : pointer;
    }
`

export const StyledThumb = styled(SwitchPrimitive.Thumb)`
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px ${({theme})=>theme?.switch?.shadow};
    transition: transform 100ms;
    transform: translateX(2px);
    will-change : transform;
    &[data-state="checked"] {
         transform: translateX(19px);
    }
`

