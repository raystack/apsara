import { styled } from "~/stitches.config";

export const Kbd = styled("kbd", {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$gray1",
    flexShrink: 0,
    color: "$gray12",
    userSelect: "none",
    cursor: "default",
    whiteSpace: "nowrap",
    boxShadow: `
    inset 0 0.5px rgba(255, 255, 255, 0.1),
    inset 0 1px 5px $colors$slate2,
    0px 0px 0px 0.5px $colors$slate8,
    0px 2px 1px -1px $colors$slate8,
    0 1px $colors$slate8`,
    textShadow: "0 0 1px rgba(255, 255, 255, 0.5)",
    fontWeight: 400,
    px: "$2",
    fontSize: "$1",
    lineHeight: "20px",
    borderRadius: "$1",
});
