import React from "react";

interface ImageProps {
    src: string;
    width?: number;
    height?: number;
}

function Image({
    src,
    width,
    height,
}: ImageProps) {
    if (!src) return null;
    return <img src={src} width={width} height={height}/>;
}

export default Image;
