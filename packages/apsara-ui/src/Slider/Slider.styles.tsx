import styled from 'styled-components';
import * as SliderPrimitive from '@radix-ui/react-slider';

export const StyledSlider = styled(SliderPrimitive.Root)`
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    min-width:100px;
    width: 100%;

    &[data-orientation="horizontal"] {
        height: 20px;
    }

    &[data-orientation="vertical"] {
        flex-direction: column;
        width: 20px;
        min-height:200px;
        height: 100%;
    }

    &[data-disabled] {
        cursor: not-allowed
    }
`

export const StyledTrack = styled(SliderPrimitive.Track)`
    background-color: ${({theme})=>theme?.slider?.track};
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;

    &[data-orientation="horizontal"] { height: 3px }
    &[data-orientation="vertical"] { width: 3px }
`

export const StyledRange = styled(SliderPrimitive.Range)`
    position: absolute;
    background-color: ${({theme})=>theme?.slider?.range};
    border-radius: 9999px;
    height: 100%;
`

export const StyledThumb = styled(SliderPrimitive.Thumb)`
    all: unset;
    display: block;
    width: 20px;
    height: 20px;
    background-color: ${({theme})=>theme?.slider?.thumb};
    box-shadow: 0 2px 10px ${({theme})=>theme?.slider?.shadow};
    border-radius: 10px;
    &:hover { background-color: ${({theme})=>theme?.slider?.thumbHover} }
    &:focus { box-shadow: 0 0 0 3px ${({theme})=>theme?.slider?.thumbFocus} }
    &[data-disabled]{
        background-color: ${({theme})=>theme?.slider?.disabled}
    }
`
