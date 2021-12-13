import styled from "styled-components";
import { Row, Skeleton } from "antd";

export const StyledSkeleton = styled(Skeleton)`
    .ant-skeleton-content .ant-skeleton-title {
        height: 40px;
        margin-bottom: 40px;
        background: ${({ theme }) => theme?.loader?.main};
    }
    .ant-skeleton-content .ant-skeleton-paragraph > li {
        height: 24px;
        background: ${({ theme }) => theme?.loader?.main};
    }
    .ant-skeleton-paragraph > li + li {
        margin-top: 24px;
    }
    &.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title,
    &.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph > li {
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme?.loader?.main} 25%,
            ${({ theme }) => theme?.loader?.active} 37%,
            ${({ theme }) => theme?.loader?.main} 63%
        );
        background-size: 400% 100%;
    }
`;

export const StyledRow = styled(Row)`
    .ant-skeleton-content .ant-skeleton-paragraph > li {
        height: 32px;
    }
`;
