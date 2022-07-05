import React from "react";
import Button from "../Button";
import { Overlay, InfoBox, HeadingWrapper, Title, CloseDiv } from "./InfoModal.styles";
import { CloseOutlined } from "@ant-design/icons";

interface InfoModalProps {
    children?: React.ReactNode;
    heading: string;
    onClose: () => void;
    visible?: boolean;
}

const InfoModal = ({ children, heading = "", onClose, visible = false, ...props }: InfoModalProps) => {
    return visible ? (
        <Overlay>
            <InfoBox {...props}>
                <HeadingWrapper>
                    <Title title={heading}>{heading}</Title>
                    <CloseDiv>
                        <Button type="text" onClick={onClose}>
                            <CloseOutlined style={{ fontSize: "20px" }} />
                        </Button>
                    </CloseDiv>
                </HeadingWrapper>
                {children}
            </InfoBox>
        </Overlay>
    ) : null;
};

export default InfoModal;
