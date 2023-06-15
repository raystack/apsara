import { css, styled } from "~/stitches.config";

export const panelStyles = css({
    backgroundColor: "$bgBase",
    borderRadius: "$1",
    border: "1px solid $borderBase",
});

export const Panel = styled("div", panelStyles);
