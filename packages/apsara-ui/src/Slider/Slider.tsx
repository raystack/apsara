import React from 'react';
import { StyledSlider, StyledRange, StyledThumb, StyledTrack } from './Slider.styles';

type SliderProps={
    defaultValue? : number[],
    value? : number[],
    name?: string,
    disabled?: boolean,
    onChange?: (value: number[])=> void,
    orientation?: "horizontal" | "vertical",
    dir?: "ltr" | "rtl",
    min?: number,
    max?: number,
    step?: number,
}

const Slider = ({
    defaultValue,
    value,
    onChange,
    min,
    max,
    step,
    ...props
}: SliderProps) => (
    <StyledSlider defaultValue={defaultValue} value={value} onValueChange={onChange} min={min}
    max={max} step={step} disabled = {props.disabled} name = {props.name} orientation={props.orientation}
    dir ={props.dir}  aria-label="Volume">
      <StyledTrack>
        <StyledRange />
      </StyledTrack>
      <StyledThumb />
    </StyledSlider>
);

export default Slider;
