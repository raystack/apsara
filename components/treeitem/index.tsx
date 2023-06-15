import { styled } from "~/stitches.config";

export const TreeItem = styled("div", {
    // Reset
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    lineHeight: "1",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    "&:disabled": {
        pointerEvents: "none",
    },
    "&::before": {
        boxSizing: "border-box",
    },
    "&::after": {
        boxSizing: "border-box",
    },

    // Custom
    height: "29px",
    px: "$2",
    fontSize: "$1",
    color: "$fgBase",
});
