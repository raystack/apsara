import type { FC, ReactNode } from "react";
import React from "react";
import { Flex } from "~/components/flex";
import type { CSS } from "~/stitches.config";

export interface TableTopContainerProps {
    css?: CSS;
    children?: ReactNode;
}

export const TableTopContainer: FC<TableTopContainerProps> = ({ children, css }) => {
    return <Flex css={css}>{children}</Flex>;
};
