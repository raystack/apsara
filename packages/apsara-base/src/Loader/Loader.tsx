import React from "react";
import { Row, Col, Skeleton } from "antd";
import "./style.less";

interface ListLoaderProps {
    className: string;
    rows?: number;
}
export const ListLoader = ({ className, rows = 20 }: ListLoaderProps) => {
    return <Skeleton className={className} active title={false} paragraph={{ rows, width: "100%" }} />;
};

interface EditorLoaderProps {
    className: string;
}
export const EditorLoader = ({ className }: EditorLoaderProps) => {
    return <Skeleton className={className} active title={false} paragraph={{ rows: 5, width: "80%" }} />;
};

export const DetailsLoader = () => {
    return (
        <div>
            <Row className="top-row" justify="space-between">
                <Col span={4}>
                    <Skeleton active title={false} paragraph={{ rows: 1, width: "100%" }} />
                </Col>
                <Col span={8}>
                    <Skeleton active title={false} paragraph={{ rows: 1, width: "100%" }} />
                </Col>
            </Row>
            <Skeleton active paragraph={{ rows: 15, width: "100%" }} />
        </div>
    );
};
