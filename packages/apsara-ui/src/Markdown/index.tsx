// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import { Wrapper } from "./Markdown.styles";

const Markdown = ({ data, style }: any) => {
    // eslint-disable-next-line react/no-danger
    return <Wrapper style={style} dangerouslySetInnerHTML={{ __html: data }} />;
};

export default Markdown;
