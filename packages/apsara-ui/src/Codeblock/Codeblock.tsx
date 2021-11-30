import React, { useRef } from "react";
import Icon from "../Icon";
import { showSuccess, showError } from "../Notification";
import { Container, CopyBtn, Viewer } from "./Codeblock.styles";

interface CodeblockProps {
    lang?: string;
    children?: string;
    copy?: boolean;
    className?: string;
}

const Codeblock = ({ lang = "text", children = "", copy = false, className = "" }: CodeblockProps) => {
    const codeRef = useRef(null);
    function fallbackCopyTextToClipboard() {
        const node = codeRef?.current;
        if (window.getSelection && node) {
            window.getSelection()?.selectAllChildren(node);
            document.execCommand("Copy");
            showSuccess("Copied to Clipboard");
        } else {
            showError("Unable to Copy");
        }
    }

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(children)
                .then(() => {
                    showSuccess("Copied to Clipboard");
                })
                .catch(() => {
                    showError("Unable to Copy");
                });
        } else {
            fallbackCopyTextToClipboard();
        }
    };
    return (
        <Container className={className}>
            {copy ? (
                <CopyBtn onClick={handleCopy}>
                    <Icon name="copy2" styleOverride={{ color: "white" }} />
                </CopyBtn>
            ) : null}
            <Viewer lang={lang} ref={codeRef}>
                {children}
            </Viewer>
        </Container>
    );
};

export default Codeblock;
