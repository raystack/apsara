import { styled } from "~/stitches.config";

export const TabLink = styled("a", {
    position: "relative",
    flexShrink: 0,
    height: "$6",
    display: "inline-flex",
    lineHeight: 1,
    fontSize: "$1",
    px: "$3",
    userSelect: "none",
    outline: "none",
    alignItems: "center",
    justifyContent: "center",
    color: "$fgBase",
    textDecoration: "none",
    "@hover": {
        "&:hover": {
            color: "$fgSubtle",
        },
    },

    variants: {
        active: {
            true: {
                color: "$fgBase",
                cursor: "default",
                "&::after": {
                    position: "absolute",
                    content: '""',
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "$bgBase",
                },
            },
        },
    },
});
