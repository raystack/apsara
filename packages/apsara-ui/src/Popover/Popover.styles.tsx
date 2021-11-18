import React from "react";
import styled from "styled-components";
import { Popover, PopoverProps } from "antd";

export const Container = styled.div`
    font-size: 12px;
    width: 260px;
    margin: -12px -16px;
`;

export const Content = styled.div`
    padding: 16px;
`;

export const Title = styled.div`
    font-weight: bold;
    letter-spacing: 0.3px;
    line-height: 16px;
    margin-bottom: 8px;
`;

export const Message = styled.div`
    min-height: 30px;
    letter-spacing: 0.3px;
`;

export const Footer = styled.div`
    padding: 12px 16px;
    border-top: 1px solid ${({ theme }) => theme?.colors?.black[4]};

    button {
        font-size: 12px;
    }

    button + button {
        margin-left: 16px;
    }
`;

export const StyledPopover = styled(({ className, ...props }: { className?: string } & PopoverProps) => (
    <Popover {...props} overlayClassName={className} />
))`
    .ant-popover-inner {
        border-radius: 4px;
        overflow: hidden;
        background: ${({ theme }) => theme?.popover?.bg};
    }

    .ant-popover-inner-content {
        color: ${({ theme }) => theme?.popover?.text};
    }

    .ant-popover-arrow-content {
        background: ${({ theme }) => theme?.popover?.bg};
    }
`;
