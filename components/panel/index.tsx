import { css, styled } from "~/stitches.config";

export const panelStyles = css({
    backgroundColor: "$bgBase",
    borderRadius: "$1",
    boxShadow: "$sm",
    border: "1px solid $borderSubtle",
});

export const Panel = styled("div", panelStyles);
