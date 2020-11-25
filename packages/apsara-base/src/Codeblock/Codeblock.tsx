import React from "react";
import "./style.less";
import Icon from "../Icon";
import { showSuccess, showError } from "../Notification";

interface CodeblockProps {
    lang?: string;
    children?: string;
    copy?: boolean;
}

const Codeblock = ({ lang = "text", children = "", copy = false }: CodeblockProps) => {
    const handleCopy = () => {
        navigator.clipboard
            .writeText(children)
            .then(() => {
                showSuccess("Copied to Clipboard");
            })
            .catch(() => {
                showError("Unable to Copy");
            });
    };
    return (
        <div className="code-container">
            {copy ? (
                <div className="code-copy-btn" onClick={handleCopy}>
                    <Icon name="copy2" styleOverride={{ color: "white" }} />
                </div>
            ) : null}
            <pre className="code-viewer" lang={lang}>
                {children}
            </pre>
        </div>
    );
};

export default Codeblock;
