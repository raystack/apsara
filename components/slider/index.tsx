import * as SliderPrimitive from "@radix-ui/react-slider";
import React from "react";
import { CSS, styled } from "~/stitches.config";

const SliderTrack = styled(SliderPrimitive.Track, {
    position: "relative",
    flexGrow: 1,
    backgroundColor: "$bgInset",
    borderRadius: "$pill",
    '&[data-orientation="horizontal"]': {
        height: 2,
    },
    '&[data-orientation="vertical"]': {
        width: 2,
        height: 100,
    },
});

const SliderRange = styled(SliderPrimitive.Range, {
    position: "absolute",
    background: "$bgAccent",
    borderRadius: "inherit",
    '&[data-orientation="horizontal"]': {
        height: "100%",
    },
    '&[data-orientation="vertical"]': {
        width: "100%",
    },
});

const SliderThumb = styled(SliderPrimitive.Thumb, {
    position: "relative",
    display: "block",
    width: 15,
    height: 15,
    outline: "none",
    opacity: "0.6",
    backgroundColor: "$bgAccent",
    boxShadow: "$sm",
    borderRadius: "$round",

    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -2,
        transform: "scale(1)",
        borderRadius: "$round",
        transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
    },

    "&:focus": {
        "&::after": {
            transform: "scale(2)",
        },
    },
});

export const StyledSlider = styled(SliderPrimitive.Root, {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none",
    touchAction: "none",
    height: 15,
    flexGrow: 1,

    '&[data-orientation="vertical"]': {
        flexDirection: "column",
        width: 15,
    },

    "@hover": {
        "&:hover": {
            [`& ${SliderTrack}`]: {
                backgroundColor: "$bgInset",
            },
            [`& ${SliderThumb}`]: {
                opacity: "1",
            },
        },
    },
});

type SliderPrimitiveProps = React.ComponentProps<typeof SliderPrimitive.Root>;
type SliderProps = SliderPrimitiveProps & { css?: CSS };

export const Slider = React.forwardRef<React.ElementRef<typeof StyledSlider>, SliderProps>((props, forwardedRef) => {
    const hasRange = Array.isArray(props.defaultValue || (props as any).value);
    const thumbsArray = hasRange
        ? props.defaultValue || (props as any).value
        : [props.defaultValue || (props as any).value];

    return (
        <StyledSlider {...props} ref={forwardedRef}>
            <SliderTrack>
                <SliderRange />
            </SliderTrack>
            {thumbsArray.map((_: any, i: number) => (
                <SliderThumb key={i} />
            ))}
        </StyledSlider>
    );
});
