/* eslint-disable react/no-array-index-key */
import React from "react";
import { Row, Col, Collapse } from "antd";
import "./style.less";

const { Panel } = Collapse;

interface SegmentsProps {
    span?: number;
    children?: React.ReactNode;
}

const Segments = ({ span = 10, children }: SegmentsProps) => (
    <Col className="segment__container" span={span}>
        {children}
    </Col>
);

interface SegmentRowsProps {
    label: string;
    value: string;
    key?: string | number;
}

const SegmentRow = ({ label, value }: SegmentRowsProps) => (
    <div className="segment__row">
        <div className="segment__row--key">{label}</div>
        <div className="segment__row--value">{value}</div>
    </div>
);

interface SegmentTitleProps {
    title: string;
}

const SegmentTitle = ({ title }: SegmentTitleProps) => <div className="segment__title">{title}</div>;

interface SegmentProps {
    title: string;
    rowData?: Array<SegmentRowsProps>;
    children?: React.ReactNode;
}

const Segment = ({ title, rowData = [], children }: SegmentProps) => (
    <Row className="segment">
        <SegmentTitle title={title} />
        {rowData.map((data, index) => (
            <SegmentRow key={`${data.key}_${index}`} {...data} />
        ))}
        {children}
    </Row>
);

interface AdvancedConfigProps {
    rowData?: Array<SegmentRowsProps>;
    title?: string;
}

const AdvancedConfigsSegment = ({ rowData = [], title = "Advanced configurations" }: AdvancedConfigProps) => {
    return (
        <Row className="segment advanced-segment">
            <Collapse expandIconPosition="right" bordered={false}>
                <Panel header={title} key="1">
                    {rowData.map((d, index) => (
                        <SegmentRow key={`${d.key}_${index}`} {...d} />
                    ))}
                </Panel>
            </Collapse>
        </Row>
    );
};

Segments.SegmentTitle = SegmentTitle;
Segments.Segment = Segment;
Segments.SegmentRow = SegmentRow;
Segments.AdvancedConfigsSegment = AdvancedConfigsSegment;

export default Segments;
