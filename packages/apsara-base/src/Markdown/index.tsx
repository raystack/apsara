// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import "./style.less";

const Markdown = ({ data, style }: any) => {
    // eslint-disable-next-line react/no-danger
    return <div className="markdown-wrapper" style={style} dangerouslySetInnerHTML={{ __html: data }} />;
};
export default Markdown;
