import React, { useState } from "react";
import styled from "styled-components";

interface ImageProps {
    src: string;
    width?: number;
    height?: number;
    preview?: boolean;
}

const Overlay = styled("div")`
    position: fixed;
    display: none;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    cursor: pointer;
`;

function Image({ src, width, height, preview }: ImageProps) {
    const [show, setShow] = useState(false);
    if (!src) return null;
    return (
        <>
            <Overlay onClick={() => setShow(false)} style={{ display: show ? "flex" : "none" }}>
                {show && <img src={src} width="80%" />}
            </Overlay>
            <img
                onClick={preview ? () => setShow(true) : () => null}
                src={src}
                width={width}
                height={height}
                style={{ cursor: preview ? "pointer" : "auto" }}
            />
        </>
    );
}

export default Image;
