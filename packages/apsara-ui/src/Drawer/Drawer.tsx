import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import Icon from "../Icon";
import { Overlay, Body, Wrapper } from "./Drawer.styles";

type DrawerProps = {
    onClose: () => void;
    onOverlayClick?: () => void;
    disableCloseOnOverlayClick?: boolean; // default: true
    open?: boolean;
    className?: string;
    position?: "left" | "right";
    children?: React.ReactNode;
};

const Drawer = ({ onOverlayClick, disableCloseOnOverlayClick, onClose, open = false, children, className = "", position = "right" }: DrawerProps) => {
    const theme = useContext(ThemeContext);

    if (!open) return null;
    return (
        <Wrapper>
            <Overlay onClick={() => {
                if (!disableCloseOnOverlayClick) onClose();
                if (onOverlayClick) onOverlayClick();
            }}>
            </Overlay>
            <Body className={className} position={position}>
                <Icon name="cross" onClick={onClose} color={theme?.drawer?.close} />
                {children}
            </Body>
        </Wrapper>

    );
};

export default Drawer;
