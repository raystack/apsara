import { styled } from "~/stitches.config";

export const Code = styled("code", {
    fontFamily: "$mono",
    fontSize: "max($2, 85%)",
    whiteSpace: "nowrap",
    padding: "0 3px 2px 3px",

    variants: {
        variant: {
            gray: {
                backgroundColor: "$slate3",
                color: "$slate11",
            },
            primary: {
                backgroundColor: "$primary3",
                color: "$primary11",
            },
        },
    },
    defaultVariants: {
        variant: "violet",
    },
});
