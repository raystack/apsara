import React, { useRef } from "react";
import "./style.less";
import Icon from "../Icon";
import { showSuccess, showError } from "../Notification";
import clsx from "clsx";

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
        <div className={clsx("code-container", className)}>
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
