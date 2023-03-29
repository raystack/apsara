import { styled } from "~/stitches.config";

export const Text = styled("span", {
    // Reset
    lineHeight: "1",
    margin: "0",
    fontWeight: 400,
    fontVariantNumeric: "tabular-nums",
    display: "block",

    variants: {
        size: {
            "1": {
                fontSize: "$1",
            },
            "2": {
                fontSize: "$2",
            },
            "3": {
                fontSize: "$3",
            },
            "4": {
                fontSize: "$4",
            },
            "5": {
                fontSize: "$5",
            },
            "6": {
                fontSize: "$6",
            },
            "7": {
                fontSize: "$7",
            },
            "8": {
                fontSize: "$8",
            },
            "9": {
                fontSize: "$9",
            },
        },
        variant: {
            red: {
                color: "$red11",
            },
            crimson: {
                color: "$crimson11",
            },
            pink: {
                color: "$pink11",
            },
            purple: {
                color: "$purple11",
            },
            violet: {
                color: "$violet11",
            },
            indigo: {
                color: "$indigo11",
            },
            blue: {
                color: "$blue11",
            },
            cyan: {
                color: "$cyan11",
            },
            teal: {
                color: "$teal11",
            },
            green: {
                color: "$green11",
            },
            lime: {
                color: "$lime11",
            },
            yellow: {
                color: "$yellow11",
            },
            orange: {
                color: "$orange11",
            },
            gold: {
                color: "$gold11",
            },
            bronze: {
                color: "$bronze11",
            },
            gray: {
                color: "$slate11",
            },
            contrast: {
                color: "$hiContrast",
            },
        },
    },
    defaultVariants: {
        size: "3",
        variant: "contrast",
    },
});
