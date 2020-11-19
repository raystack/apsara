import React from "react";
import Icon from "../Icon";

import "./style.less";

type DrawerProps = {
    onClose?: () => void;
    open?: boolean;
    className?: string;
    position?: "left" | "right";
    children?: React.ReactNode;
};

const Drawer = ({ onClose, open = false, children, className = "", position = "right" }: DrawerProps) => {
    if (!open) return null;

    return (
        <div className="drawer__container">
            <div className="drawer__container--overlay">
                <div className={`drawer__container--body ${className} ${position}`}>
                    <Icon name="cross" onClick={onClose} />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
