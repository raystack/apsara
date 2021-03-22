import React from "react";
import { Image as StyledImage } from "antd";

interface CustomIllustrationProps {
    src: string;
    width?: number;
    height?: number;
    preview?: boolean;
}

function Image({ preview = false, ...props }: CustomIllustrationProps) {
    if (!props.src) return null;
    return <StyledImage preview={preview} {...props} />;
}

export default Image;
