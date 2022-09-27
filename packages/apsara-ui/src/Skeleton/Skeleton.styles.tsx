import styled from "styled-components";

export const StyledSkeleton = styled.div <{ $props?: any, $editor?: boolean }>`
height:24px;
width: ${({ $props }) => $props?.width ? $props.width : "100%"};

li + li {
    margin-top: 24px;
}

li:last-child {
    width: ${({ $editor, $props }) => $editor ? $props.lastLineWidth : ''
    }

`

export const ListItem = styled.li`
background: linear-gradient(90deg, rgb(245, 245, 245) 25%, rgb(234, 234, 234) 37%, rgb(245, 245, 245) 63%) 0% 0% / 400% 100%;
animation: ant-skeleton-loading 1.4s ease infinite;
height: 24px;
list-style: none;
border-radius: 4px;
`

export const StyledRow = styled.div <{ $props?: any }>`
background: linear-gradient(90deg, rgb(245, 245, 245) 25%, rgb(234, 234, 234) 37%, rgb(245, 245, 245) 63%) 0% 0% / 400% 100%;
animation: ant-skeleton-loading 1.4s ease infinite;
height: ${({ $props }) => $props.height};
border-radius: 4px;
max-width: ${({ $props }) => calculateWidth($props.maxWidth)};
flex: ${({ $props }) => `0 0 ${calculateWidth($props.width)}}`};
`

const calculateWidth = (width: number) => {
    return (width / 24) * 100 + '%'
}