import React, { useState } from "react";
import Button from "../Button/Button";
import { CustomButtonProps } from "../Button/Button.types";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
    StyledPopover,
    PopoverTrigger,
    StyledArrow,
    Container,
    Content,
    Footer,
    Message,
    Title,
    StyledContent,
} from "./Popover.styles";

interface ButtonPopoverContentProps {
    title: string;
    message?: string;
    content?: React.ReactNode | null;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    onOk?: () => void;
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
    const { text: okText, ...restOkBtnProps } = okBtnProps;
    const { text: cancelText, ...restCancelBtnProps } = cancelBtnProps;

    return (
        <Container>
            <Content>
                <Title>{title}</Title>
                <Message>{message || content}</Message>
            </Content>
            {(okText || cancelText) && (
                <Footer className="apsara-popover-footer">
                    {okText ? (
                        <Button onClick={onOk} size="small" type="primary" {...restOkBtnProps}>
                            {okText}
                        </Button>
                    ) : null}
                    {cancelText ? (
                        <Button onClick={onCancel} size="small" {...restCancelBtnProps}>
                            {cancelText}
                        </Button>
                    ) : null}
                </Footer>
            )}
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
    open,
    onOpenChange = () => ({}),
    onOk,
    onCancel,
    okBtnProps,
    cancelBtnProps,
    children,
}: ButtonConfirmationPopover) {
    const [internalOpen, setInternalOpen] = useState(false);
    const controlled = typeof open !== "boolean";

    const onOKClick = () => {
        if (controlled) {
            setInternalOpen(false);
        }
        if (onOk) {
            onOk();
        } else if (onOpenChange) {
            onOpenChange(false);
        }
    };

    const onCancelClick = () => {
        if (controlled) {
            setInternalOpen(false);
        }
        if (onCancel) {
            onCancel();
        } else if (onOpenChange) {
            onOpenChange(false);
        }
    };

    const finalOpen = controlled ? internalOpen : open;

    return (
        <StyledPopover
            open={finalOpen}
            onOpenChange={(value) => {
                if (controlled) setInternalOpen(value);
                else {
                    onOpenChange && onOpenChange(value);
                }
            }}
        >
            <PopoverTrigger asChild>
                <span aria-label="Update dimensions">{children}</span>
            </PopoverTrigger>
            <PopoverPrimitive.Portal>
                <StyledContent className="apsara-popover-content" side="bottom" align="end">
                    <PopoverContent
                        title={title}
                        message={message}
                        content={content}
                        onOk={onOKClick}
                        onCancel={onCancelClick}
                        okBtnProps={okBtnProps}
                        cancelBtnProps={cancelBtnProps}
                    />
                    <StyledArrow />
                </StyledContent>
            </PopoverPrimitive.Portal>
        </StyledPopover>
    );
}

export default ConfirmationPopover;
