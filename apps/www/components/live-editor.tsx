import { styled, useApsaraTheme } from "@odpf/apsara";
import { themes } from "prism-react-renderer";
import React from "react";
import { LiveEditor as Editor } from "react-live";

interface Props {
    code: string;
    number?: boolean;
    border?: boolean;
}

const Area = styled("div", {
    position: "relative",
    whiteSpace: "pre",
    fontFamily: "SF Mono, ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
    lineHeight: "1.5",
    color: "$gray4",
    fontSize: "13px",
    px: "$2",

    variants: {
        border: {
            true: {
                borderRadius: "$2",
                border: "1px solid $gray4",
            },
        },
    },
});

const StyledLiveEditor = styled(Editor, {
    variants: {
        number: {
            true: {
                pre: {
                    counterReset: "token-line",
                },
                ".token-line::before": {
                    counterIncrement: "token-line",
                    content: "counter(token-line)",
                    paddingRight: "10px",
                },
            },
        },
    },
});

const LiveEditor: React.FC<Props> = ({ code, number, border }) => {
    const { themeName } = useApsaraTheme();
    return (
        <Area border={border}>
            <StyledLiveEditor
                theme={themeName === "light" ? themes.nightOwlLight : themes.nightOwl}
                number={number}
                code={code.trim()}
            />
        </Area>
    );
};

export default LiveEditor;
