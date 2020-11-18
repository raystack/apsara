import React from "react";
import Icon from "../Icon";

import "./style.less";

type ModalProps = {
    onClose?: () => void;
    open?: boolean;
    className?: string;
    type?: "left" | "right";
    children?: React.ReactNode;
};

const Modal = ({ onClose, open = false, children, className = "", type = "right" }: ModalProps) => {
    if (!open) return null;

    return (
        <div className="modal__container">
            <div className="modal__container--overlay">
                <div className={`modal__container--body ${className} ${type}`}>
                    <Icon name="cross" onClick={onClose} />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
