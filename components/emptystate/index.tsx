import { styled } from "~/stitches.config";

export const EmptyState = styled("div", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 560,
    height: "100%",
    margin: "0 auto",

    ".svg-container": {
        background: "$gray3",
        display: "flex",
        alignCenter: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 16,
        svg: {
            width: 32,
            height: 32,
            color: "$gray500",
        },
    },
    h3: {
        fontSize: "$4",
        fontWeight: 600,
        color: "$gray12",
        marginTop: "$4",
    },

    ".pera": {
        fontSize: "$4",
        color: "$gray11",
        marginTop: "$1",
        span: {
            cursor: "pointer",
            color: "$gray12",
            fontWeight: 500,
            padding: 4,
            borderRadius: 6,
            "&:hover": {
                background: "$gray3",
            },
        },
        a: {
            cursor: "pointer",
            color: "$primary11",
            fontWeight: 500,
            padding: 4,
            borderRadius: 6,
            "&:hover": {
                background: "$primary3",
            },
        },
    },
});
