import React from "react";
import Button from "../Button";
import { Overlay, Content, Title, HeadingWrapper, CloseDiv } from "./Modal.styles";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
    children?: React.ReactNode;
    heading: string;
    closable?: boolean;
    onClose?: () => void;
    open?: boolean;
    width?: string;
    maskStyle?: React.CSSProperties;
}

const Modal = ({
    children,
    heading = "",
    closable = true,
    onClose,
    open = false,
    width = "50vw",
    maskStyle = { background: "rgba(0 0 0 / 0.5);" },
}: ModalProps) => {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={
                closable
                    ? onClose
                    : () => {
                          /*nothing to do here */
                      }
            }
        >
            <Dialog.Portal>
                <Overlay style={maskStyle}>
                    <Content style={{ width: `${width}` }}>
                        <HeadingWrapper>
                            <Title>
                                <div>{heading}</div>
                                {closable && (
                                    <CloseDiv>
                                        <Button type="text" onClick={onClose}>
                                            <Cross2Icon transform="scale(1.3334)" />
                                        </Button>
                                    </CloseDiv>
                                )}
                            </Title>
                        </HeadingWrapper>
                        <Dialog.Description>{children}</Dialog.Description>
                    </Content>
                </Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
