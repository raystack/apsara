import type { FC, ReactNode } from "react";
import React from "react";
import { Flex } from "~/components/flex";
import type { CSS } from "~/stitches.config";

export interface TableDetailContainerProps {
    css?: CSS;
    children?: ReactNode;
}

export const TableDetailContainer: FC<TableDetailContainerProps> = ({ children, css }) => {
    return <Flex css={css}>{children}</Flex>;
};
