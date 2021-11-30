import React, { useState } from "react";
import Button from "../Button/Button";
import { CustomButtonProps } from "../Button/Button.types";
import { Container, Content, Message, Title, Footer, StyledPopover } from "./Popover.styles";

interface ButtonPopoverContentProps {
    title: string;
    message?: string;
    content?: React.ReactNode | null;
    onOk: () => void;
    onCancel?: () => void;
    okBtnProps?: {
        text?: string;
    } & CustomButtonProps;
    cancelBtnProps?: {
        text?: string;
    } & CustomButtonProps;
}

export const PopoverContent = ({
    title,
    message,
    content,
    onOk,
    onCancel,
    okBtnProps = {},
    cancelBtnProps = {},
}: ButtonPopoverContentProps) => {
    const { text: okText = "Yes", ...restOkBtnProps } = okBtnProps;
    const { text: cancelText, ...restCancelBtnProps } = cancelBtnProps;

    return (
        <Container>
            <Content>
                <Title>{title}</Title>
                <Message>{message || content}</Message>
            </Content>
            <Footer>
                <Button onClick={onOk} size="small" type="primary" {...restOkBtnProps}>
                    {okText}
                </Button>
                {cancelText ? (
                    <Button onClick={onCancel} size="small" {...restCancelBtnProps}>
                        {cancelText}
                    </Button>
                ) : null}
            </Footer>
        </Container>
    );
};

interface ButtonConfirmationPopover extends ButtonPopoverContentProps {
    children?: React.ReactNode;
}

function ConfirmationPopover({
    title = "",
    message = "",
    content = null,
    onOk,
    onCancel = () => ({}),
    okBtnProps,
    cancelBtnProps,
    children,
}: ButtonConfirmationPopover) {
    const [visible, setVisible] = useState(false);

    const onOKClick = () => {
        setVisible(false);
        onOk();
    };

    const onCancelClick = () => {
        setVisible(false);
        onCancel();
    };

    return (
        <StyledPopover
            visible={visible}
            onVisibleChange={setVisible}
            content={
                <PopoverContent
                    title={title}
                    message={message}
                    content={content}
                    onOk={onOKClick}
                    onCancel={onCancelClick}
                    okBtnProps={okBtnProps}
                    cancelBtnProps={cancelBtnProps}
                />
            }
            trigger="click"
            placement="bottomRight"
        >
            {children}
        </StyledPopover>
    );
}

export default ConfirmationPopover;
