import React from "react";
import { Col } from "antd";
import { StyledRow, StyledSkeleton } from "./Loader.styles";

interface ListLoaderProps {
    className?: string;
    rows?: number;
}
export function ListLoader({ className = "", rows = 20 }: ListLoaderProps) {
    return <StyledSkeleton className={className} active title={false} paragraph={{ rows, width: "100%" }} />;
}

interface EditorLoaderProps {
    className?: string;
}
export function EditorLoader({ className = "" }: EditorLoaderProps) {
    return <StyledSkeleton className={className} active title={false} paragraph={{ rows: 5, width: "80%" }} />;
}

export const DetailsLoader = () => {
    return (
        <div>
            <StyledRow className="top-row" justify="space-between">
                <Col span={4}>
                    <StyledSkeleton active title={false} paragraph={{ rows: 1, width: "100%" }} />
                </Col>
                <Col span={8}>
                    <StyledSkeleton active title={false} paragraph={{ rows: 1, width: "100%" }} />
                </Col>
            </StyledRow>
            <StyledSkeleton active paragraph={{ rows: 15, width: "100%" }} />
        </div>
    );
};
