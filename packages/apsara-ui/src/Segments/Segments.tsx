/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { Row, Key, Value, Title, Wrapper, CollapsibleHeader } from "./Segments.styles";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface SegmentsProps {
    span?: number;
    children?: React.ReactNode;
}

const calculateWidth = (span: number) => {
    return (span / 24) * 100 + "%";
};

const Segments = ({ span = 10, children }: SegmentsProps) => (
    <div style={{ maxWidth: calculateWidth(span) }}> {children}</div>
);

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
    const [open, setOpen] = useState(false);
    return (
        <Wrapper $advance>
            <Collapsible.Root open={open}>
                <CollapsibleHeader className="radix-collpase-header" onClick={() => setOpen(!open)}>
                    <span style={{ paddingRight: "10px" }}>{title}</span>
                    {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </CollapsibleHeader>
                <Collapsible.CollapsibleContent>
                    {rowData.map((d, index) => (
                        <SegmentRow key={`${d.key}_${index}`} {...d} />
                    ))}
                </Collapsible.CollapsibleContent>
            </Collapsible.Root>
        </Wrapper>
    );
};

Segments.SegmentTitle = SegmentTitle;
Segments.Segment = Segment;
Segments.SegmentRow = SegmentRow;
Segments.AdvancedConfigsSegment = AdvancedConfigsSegment;

export default Segments;
