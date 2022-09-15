import React from "react";
import Button from "../Button";
import { Overlay, Content, Title, HeadingWrapper, CloseDiv } from "./Modal.styles";
import { CloseOutlined } from "@ant-design/icons";
import * as Dialog from "@radix-ui/react-dialog";


interface ModalProps {
    children?: React.ReactNode;
    heading: string;
    closable?: boolean;
    onClose?: () => void;
    open?: boolean;
    width?: string;
}

const Modal = ({ children, heading = "", closable = true, onClose, open = false, width = "50vw", ...props }: ModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={closable ? onClose : () => { }} >
            <Dialog.Portal>
                <Overlay>
                    <Content style={{ width: `${width}` }}>
                        <HeadingWrapper>
                            <Title>
                                <div>{heading}</div>
                                {closable && (
                                    <CloseDiv>
                                        <Button type="text" onClick={onClose}>
                                            <CloseOutlined style={{ fontSize: "20px" }} />
                                        </Button>
                                    </CloseDiv>
                                )
                                }
                            </Title>
                        </HeadingWrapper>
                        <Dialog.Description>
                            {children}
                        </Dialog.Description>
                    </Content>
                </Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default Modal;
