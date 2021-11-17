import styled from "styled-components";
import { Switch as AntdSwitch } from "antd";

const Switch = styled(AntdSwitch)`
    &.ant-switch-checked {
        background-color: ${({ theme }) => theme?.colors?.primary[4]};
        .ant-switch-loading-icon {
            color: ${({ theme }) => theme?.colors?.primary[4]};
        }
    }
    .ant-switch-inner {
        color: ${({ theme }) => theme?.colors?.black[0]};
    }
    .ant-switch-handle::before {
        background-color: ${({ theme }) => theme?.colors?.black[0]};
    }
`;

export default Switch;
