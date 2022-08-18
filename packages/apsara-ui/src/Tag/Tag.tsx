import React, { useState, ReactNode } from "react";
import { StyledTag, TagWrapper } from "./Tag.styles";
import * as Icons from "@odpf/icons";
import Colors from "../Colors";

const Cross = Icons["cross"];

type TagProps = {
    children?: ReactNode;
    type?: "round" | "rect";
    color?: string;
    closable?: boolean;
    closeIcon?: ReactNode;
    icon?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

const Tag = ({
    children,
    color = "lightblue",
    type = "rect",
    closable = false,
    closeIcon,
    icon,
    ...props
}: TagProps) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;
    return (
        <TagWrapper>
            <StyledTag {...props} type={type} color={color} closable={closable} icon={icon ? true : false}>
                <span className="tag_icon">{icon}</span>
                <span className="tag_content">{children}</span>
                {closable && (
                    <a onClick={() => setVisible(false)}>
                        {closeIcon ? (
                            closeIcon
                        ) : (
                            <Cross
                                style={{
                                    color: Colors.dark.black[9],
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    height: "15px",
                                }}
                            />
                        )}
                    </a>
                )}
            </StyledTag>
        </TagWrapper>
    );
};

export default Tag;
