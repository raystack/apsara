import React, { useContext, ReactNode } from "react";
import { ThemeContext } from "styled-components";
import { TagProps } from "antd";
import { StyledTag } from "./Tag.styles";

interface CustomTagProps extends Omit<TagProps, "color"> {
    children?: ReactNode;
    type?: "round" | "rect";
}

export default function CustomTag({ children, type = "round", ...props }: CustomTagProps) {
    const theme = useContext(ThemeContext);
    return (
        <StyledTag {...props} type={type} color={theme?.tag?.bg}>
            {children}
        </StyledTag>
    );
}
