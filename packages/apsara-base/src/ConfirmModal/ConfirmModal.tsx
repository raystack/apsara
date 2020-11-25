import React from "react";
import Button from "../Button";
import "./style.less";

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
        <div className="modal__container">
            <div className="modal__container--overlay">
                <div className="modal__container--body confirmbox" {...props}>
                    <h3>{heading}</h3>
                    {children}
                    <div>
                        <Button
                            className="confirmbox__actionbtn"
                            type="primary"
                            loading={loading}
                            onClick={onOk}
                            disabled={okBtnDisabled}
                        >
                            {!loading ? okText : null}
                        </Button>
                        <Button className="confirmbox__actionbtn" disabled={loading} onClick={onCancel}>
                            {cancelText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default ConfirmModal;
