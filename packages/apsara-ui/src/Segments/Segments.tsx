/* eslint-disable react/no-array-index-key */
import React from "react";
import { Col, Collapse } from "antd";
import { Row, Key, Value, Title, Wrapper } from "./Segments.styles";

const { Panel } = Collapse;

interface SegmentsProps {
    span?: number;
    children?: React.ReactNode;
}

const Segments = ({ span = 10, children }: SegmentsProps) => <Col span={span}>{children}</Col>;

interface SegmentRowsProps {
    label: string;
    value: string;
    key?: string | number;
}

const SegmentRow = ({ label, value }: SegmentRowsProps) => (
    <Row>
        <Key>{label}</Key>
        <Value>{value}</Value>
    </Row>
);

interface SegmentTitleProps {
    title: string;
}

const SegmentTitle = ({ title }: SegmentTitleProps) => <Title>{title}</Title>;

interface SegmentProps {
    title: string;
    rowData?: Array<SegmentRowsProps>;
    children?: React.ReactNode;
}

const Segment = ({ title, rowData = [], children }: SegmentProps) => (
    <Wrapper>
        <SegmentTitle title={title} />
        {rowData.map((data, index) => (
            <SegmentRow key={`${data.key}_${index}`} {...data} />
        ))}
        {children}
    </Wrapper>
);

interface AdvancedConfigProps {
    rowData?: Array<SegmentRowsProps>;
    title?: string;
}

const AdvancedConfigsSegment = ({ rowData = [], title = "Advanced configurations" }: AdvancedConfigProps) => {
    return (
        <Wrapper $advance>
            <Collapse expandIconPosition="right" bordered={false}>
                <Panel header={title} key="1">
                    {rowData.map((d, index) => (
                        <SegmentRow key={`${d.key}_${index}`} {...d} />
                    ))}
                </Panel>
            </Collapse>
        </Wrapper>
    );
};

Segments.SegmentTitle = SegmentTitle;
Segments.Segment = Segment;
Segments.SegmentRow = SegmentRow;
Segments.AdvancedConfigsSegment = AdvancedConfigsSegment;

export default Segments;
