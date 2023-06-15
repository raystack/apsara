import { styled } from "~/stitches.config";

export const Kbd = styled("kbd", {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$bgBase",
    flexShrink: 0,
    color: "$fgBase",
    userSelect: "none",
    cursor: "default",
    whiteSpace: "nowrap",
    textShadow: "0 0 1px rgba(255, 255, 255, 0.5)",
    fontWeight: 400,
    px: "$2",
    fontSize: "$1",
    lineHeight: "20px",
    borderRadius: "$1",
});
