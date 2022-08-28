import styled from "styled-components";
// import { textStyles } from "../mixin";

export const Wrapper = styled.div<{ secondary: boolean }>`
    display: flex;
    position: relative;

    .input_main {
        font-size: 10px;
        font-weight: 300;
    }
`;
