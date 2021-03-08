import { Input } from "antd";
import styled from "styled-components";

const CustomInput = styled(Input)`
    &:disabled {
        color: #b3b3b3;
        ::placeholder {
            color: #b3b3b3;
        }
    }
`;

export default CustomInput;
