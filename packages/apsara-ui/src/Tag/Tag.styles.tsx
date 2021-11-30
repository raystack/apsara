import styled from "styled-components";
import { Tag } from "antd";
import { textStyles } from "../mixin";

export const StyledTag = styled(Tag)<{ type: string }>`
    ${({ theme }) => textStyles("11px", theme?.tag?.text, "0.11px", "normal")}
    border-radius: ${({ type }) => (type === "round" ? "10.5px" : "2px")};
    margin: 2px 4px 2px 0px;

    &.ant-tag-has-color .anticon-close,
    &.ant-tag-has-color .anticon-close:hover {
        color: ${({ theme }) => theme?.tag?.close};
    }
`;
