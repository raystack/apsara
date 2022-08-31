import React, { useRef } from "react";
import Icon from "../Icon";
import { ShowNotification, NotificationRef } from "../Notification";
import { Container, CopyBtn, Viewer } from "./Codeblock.styles";

interface CodeblockProps {
    lang?: string;
    children?: string;
    copy?: boolean;
    className?: string;
}

const Codeblock = ({ lang = "text", children = "", copy = false, className = "" }: CodeblockProps) => {
    const notificationRef = useRef<NotificationRef>();
    const codeRef = useRef(null);
    function fallbackCopyTextToClipboard() {
        const node = codeRef?.current;
        if (window.getSelection && node) {
            window.getSelection()?.selectAllChildren(node);
            document.execCommand("Copy");
            notificationRef?.current?.showSuccess("Copied to Clipboard");
        } else {
            notificationRef?.current?.showError("Unable to Copy");
        }
    }

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(children)
                .then(() => {
                    notificationRef?.current?.showSuccess("Copied to Clipboard");
                })
                .catch(() => {
                    notificationRef?.current?.showError("Unable to Copy");
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
            <ShowNotification ref={notificationRef} />
        </Container>
    );
};

export default Codeblock;
