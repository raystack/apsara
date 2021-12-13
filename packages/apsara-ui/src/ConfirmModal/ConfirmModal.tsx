import React from "react";
import Button from "../Button";
import { Overlay, ConfirmBox, ActionWrapper, Title } from "./ConfirmModal.styles";

interface ConfirmModalProps {
    children?: React.ReactNode;
    heading: string;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
    okText?: string;
    cancelText?: string;
    okBtnDisabled?: boolean;
    visible?: boolean;
}

const ConfirmModal = ({
    children,
    heading = "",
    loading = false,
    onOk,
    onCancel,
    okText = "Continue",
    cancelText = "Cancel",
    okBtnDisabled = false,
    visible = false,
    ...props
}: ConfirmModalProps) => {
    return visible ? (
        <Overlay>
            <ConfirmBox {...props}>
                <Title>{heading}</Title>
                {children}
                <ActionWrapper>
                    <Button type="primary" loading={loading} onClick={onOk} disabled={okBtnDisabled}>
                        {!loading ? okText : null}
                    </Button>
                    <Button disabled={loading} onClick={onCancel}>
                        {cancelText}
                    </Button>
                </ActionWrapper>
            </ConfirmBox>
        </Overlay>
    ) : null;
};

export default ConfirmModal;
