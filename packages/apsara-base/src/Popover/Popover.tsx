import React, { useState } from "react";
import { Button, Popover } from "antd";
import "./style.less";

interface ButtonPopoverContentProps {
    title: string;
    message: string;
    onOk: () => void;
}

export const PopoverContent = ({ title, message, onOk }: ButtonPopoverContentProps) => {
    return (
        <div className="popover-container">
            <div className="popover-content">
                <div className="popover-title">{title}</div>
                <div className="popover-message">{message}</div>
            </div>
            <div className="popover-footer">
                <Button onClick={onOk} size="small" type="primary">
                    Yes
                </Button>
            </div>
        </div>
    );
};

interface ButtonConfirmationPopover extends ButtonPopoverContentProps {
    children?: React.ReactNode;
}

const ConfirmationPopover = ({ title = "", message = "", onOk, children }: ButtonConfirmationPopover) => {
    const [visible, setVisible] = useState(false);

    const onClick = () => {
        setVisible(false);
        onOk();
    };

    return (
        <Popover
            visible={visible}
            onVisibleChange={setVisible}
            content={<PopoverContent title={title} message={message} onOk={onClick} />}
            trigger="click"
            placement="bottomRight"
        >
            {children}
        </Popover>
    );
};

export default ConfirmationPopover;
