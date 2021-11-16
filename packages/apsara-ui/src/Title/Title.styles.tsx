import styled, { css } from "styled-components";
import Text from "../Text";

const textStyles = (size = "12px", fade = 0.7, ls = "0px") => css`
    font-size: ${size} !important;
    font-weight: 300;
    color: rgba(0, 0, 0, ${fade}) !important;
    letter-spacing: ${ls};
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    ${textStyles("18px")}
    font-weight: bold;

    .skeleton-icon {
        margin-left: 8px;
    }
`;

export const StatusInfo = styled(Text)`
    ${textStyles("12px")}
    margin-left: 4px;
`;
