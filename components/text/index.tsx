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
                lineHeight: "16px",
                letterSpacing: "0.5px",
            },
            "2": {
                fontSize: "$2",
                lineHeight: "16px",
                letterSpacing: "0.4px",
            },
            "3": {
                fontSize: "$3",
                lineHeight: "16px",
                letterSpacing: "0.4px",
            },
            "4": {
                fontSize: "$4",
                lineHeight: "20px",
                letterSpacing: "0.25px",
            },
            "5": {
                fontSize: "$5",
                lineHeight: "24px",
                letterSpacing: "0.5px",
            },
            "6": {
                fontSize: "$6",
                lineHeight: "24px",
                letterSpacing: "0.5px",
            },
            "7": {
                fontSize: "$7",
                lineHeight: "24px",
                letterSpacing: "0.5px",
            },
            "8": {
                fontSize: "$8",
                lineHeight: "28px",
            },
            "9": {
                fontSize: "$9",
                lineHeight: "32px",
            },
            "10": {
                fontSize: "$10",
                lineHeight: "36px",
            },
            "11": {
                fontSize: "$11",
                lineHeight: "40px",
            },
            "12": {
                fontSize: "$12",
                lineHeight: "44px",
            },
            "13": {
                fontSize: "$13",
                lineHeight: "52px",
            },
            "14": {
                fontSize: "$13",
                lineHeight: "64px",
                letterSpacing: "-0.25px",
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
            default: {
                color: "inherit",
            },
        },
    },
    defaultVariants: {
        size: "2",
        variant: "default",
    },
});
