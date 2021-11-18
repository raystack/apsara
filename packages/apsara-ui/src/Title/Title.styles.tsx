import styled from "styled-components";
import Text from "../Text";
import { textStyles } from "../mixin";

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
