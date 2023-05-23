import { styled } from "@odpf/apsara";
import { ChevronRight, Copy } from "lucide-react";
import React, { useState } from "react";
import { LiveEditor } from "react-live";
import useCopyToClipboard from "./useClipboard";

interface Props {
    code: string;
}

const StyledEditor = styled("div", {
    borderRadius: "$2",
});

const Details = styled("details", {
    transition: "all 0.2s ease",
    overflow: "hidden",
});

const Summary = styled("summary", {
    boxSizing: "border-box",
    borderTop: "1px solid $gray4",
    color: "$gray11",
    width: "100%",
    listStyle: "none",
    userSelect: "none",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "$gray1"
});

const SummarySafari = styled("div", {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "2.875rem",
    padding: "$4",
});

const Action = styled("div", {
    width: "auto",
    display: "flex",
    alignItems: "center",
    fontSize: "0.8rem",
    svg: {
        cursor: "pointer",
    },
});

const Area = styled("div", {
    position: "relative",
    boxSizing: "border-box",
    whiteSpace: "pre",
    fontFamily: "Consolas,Monaco",
    lineHeight: '1.5',
    color: "$gray4",
    fontSize: "14px",
    overflow: "hidden",
    borderTop: "1px solid",
    padding: "$4",
});

const Editor: React.FC<Props> = ({ code }) => {
    const [_, copy] = useCopyToClipboard();

    const [visible, setVisible] = useState(false);
    const clickHandler = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setVisible(!visible);
    };

    const copyHandler = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        copy(code);
    };

    return (
        <StyledEditor>
            <Details open={visible}>
                <Summary onClick={clickHandler}>
                    <SummarySafari>
                        <Action>
                            <span className="arrow">
                                <ChevronRight size={16} />
                            </span>
                            <span>{"Code Editor"}</span>
                        </Action>
                        <Action>
                            {visible && (
                                <span className="copy" onClick={copyHandler} title={"Copy Code"}>
                                    <Copy size={18} />
                                </span>
                            )}
                        </Action>
                    </SummarySafari>
                </Summary>
                <Area>
                    <LiveEditor />
                </Area>
            </Details>
        </StyledEditor>
    );
};

export default Editor;
