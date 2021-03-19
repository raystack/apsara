import { Input as AntdInput } from "antd";
import styled from "styled-components";
import { width, height, zIndex, textAlign, borderRadius, space, background } from "styled-system";

const Input = styled(AntdInput)`
    && {
        ${width}
        ${height}
    ${zIndex}
    ${textAlign};
        ${borderRadius};
        ${space};
        ${background}
    }
    &:disabled {
        color: #b3b3b3;
        ::placeholder {
            color: #b3b3b3;
        }
    }
`;

export default Input;
