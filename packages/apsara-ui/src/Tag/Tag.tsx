import React, { ReactNode } from "react";
import { Tag } from "antd";
import "./style.less";

interface CustomTagProps {
    children?: ReactNode;
    type?: string;
}
export default function CustomTag({ children, type = "primary", ...props }: CustomTagProps) {
    return (
        <Tag {...props} className={`skeleton-tag ${type}`} color="rgba(77, 133, 244, 0.1)">
            {children}
        </Tag>
    );
}
