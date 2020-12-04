import React, { useRef } from "react";
import "./style.less";
import Icon from "../Icon";
import { showSuccess, showError } from "../Notification";

interface CodeblockProps {
    lang?: string;
    children?: string;
    copy?: boolean;
}

const Codeblock = ({ lang = "text", children = "", copy = false }: CodeblockProps) => {
    const codeRef = useRef(null);
    function fallbackCopyTextToClipboard() {
        if (window.getSelection) {
            window.getSelection().selectAllChildren(codeRef?.current);
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
        <div className="code-container">
            {copy ? (
                <div className="code-copy-btn" onClick={handleCopy}>
                    <Icon name="copy2" styleOverride={{ color: "white" }} />
                </div>
            ) : null}
            <pre className="code-viewer" lang={lang} ref={codeRef}>
                {children}
            </pre>
        </div>
    );
};

export default Codeblock;
