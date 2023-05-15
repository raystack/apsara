import { css, styled } from "~/stitches.config";

export const panelStyles = css({
    backgroundColor: "$gray1",
    borderRadius: "$1",
    border: "1px solid $gray4",
});

export const Panel = styled("div", panelStyles);
