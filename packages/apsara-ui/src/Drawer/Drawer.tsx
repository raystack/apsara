import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import Icon from "../Icon";
import { Overlay, Body } from "./Drawer.styles";

type DrawerProps = {
    onClose?: () => void;
    open?: boolean;
    className?: string;
    position?: "left" | "right";
    children?: React.ReactNode;
};

const Drawer = ({ onClose, open = false, children, className = "", position = "right" }: DrawerProps) => {
    const theme = useContext(ThemeContext);

    if (!open) return null;
    return (
        <Overlay>
            <Body className={className} position={position}>
                <Icon name="cross" onClick={onClose} color={theme?.drawer?.close} />
                {children}
            </Body>
        </Overlay>
    );
};

export default Drawer;
