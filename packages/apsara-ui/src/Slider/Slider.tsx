import React, { useState } from "react";
import { StyledSlider, StyledRange, StyledThumb, StyledTrack } from "./Slider.styles";

type SliderProps = {
    defaultValue?: number[];
    value?: number[];
    name?: string;
    disabled?: boolean;
    onChange?: (value: number[]) => void;
    orientation?: "horizontal" | "vertical";
    dir?: "ltr" | "rtl";
    min?: number;
    max?: number;
    step?: number;
};

const Slider = ({ defaultValue, value, onChange, min, max, step, ...props }: SliderProps) => {
    const [val, setVal] = useState(value || defaultValue);
    const onValueChange = (value: number[]) => {
        setVal(value);
        onChange && onChange(value);
    };

    return (
        <StyledSlider
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            min={min}
            max={max}
            step={step}
            disabled={props.disabled}
            name={props.name}
            orientation={props.orientation}
            dir={props.dir}
            aria-label="Volume"
        >
            <StyledTrack>
                <StyledRange />
            </StyledTrack>

            <StyledThumb data-tooltip={val} />
        </StyledSlider>
    );
};

export default Slider;
