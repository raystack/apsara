import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { CollapseWrapper, CollapsibleHeader } from "./Collapse.styles";
import classNames from "classnames";

export interface CollapseProps {
    header: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    contentForceMount?: true | undefined;
    headerStyle?: React.CSSProperties;
}

const Collapse = ({ header, children, defaultOpen = false, contentForceMount, headerStyle = {} }: CollapseProps) => {
    const prefixCls = "apsara-collapse";
    const [open, setOpen] = useState(false);

    const contentClassString = classNames(`${prefixCls}-content`, {
        [`${prefixCls}-content-hidden`]: !open,
    });

    return (
        <CollapseWrapper className={prefixCls}>
            <Collapsible.Root open={open} className={`${prefixCls}-item`} defaultOpen={defaultOpen}>
                <CollapsibleHeader
                    className={`${prefixCls}-header`}
                    onClick={() => setOpen(!open)}
                    data-state={open ? "open" : "closed"}
                    style={headerStyle}
                >
                    <span style={{ paddingRight: "10px" }}>{header}</span>
                    {<ChevronRightIcon />}
                </CollapsibleHeader>
                <Collapsible.CollapsibleContent
                    className={contentClassString}
                    data-state={open ? "open" : "closed"}
                    forceMount={contentForceMount}
                >
                    <div className={`${prefixCls}-content-box`}>{children}</div>
                </Collapsible.CollapsibleContent>
            </Collapsible.Root>
        </CollapseWrapper>
    );
};

export default Collapse;
