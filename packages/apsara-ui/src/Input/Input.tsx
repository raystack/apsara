import { Input as AntdInput } from "antd";
import styled from "styled-components";

const Input = styled(AntdInput)`
    && {
        color: ${({ theme }) => theme?.input?.text};
        background-color: ${({ theme }) => theme?.input?.bg};
        border: 1px solid ${({ theme }) => theme?.input?.border};

        :hover {
            border-color: ${({ theme }) => theme?.input?.hover};
        }

        :focus {
            border-color: ${({ theme }) => theme?.input?.hover};
            box-shadow: none;
        }

        &[disabled] {
            color: ${({ theme }) => theme?.input?.placeholder};
            background-color: ${({ theme }) => theme?.input?.disabled};
            border-color: ${({ theme }) => theme?.input?.border};

            :hover {
                border-color: ${({ theme }) => theme?.input?.border};
            }
        }
    }

    &::placeholder,
    .ant-input::placeholder {
        color: ${({ theme }) => theme?.input?.placeholder};
        font-style: italic;
    }

    &.ant-input-affix-wrapper,
    &.ant-input {
        padding: 5.5px 11px;
    }
    &.ant-input-affix-wrapper-lg,
    &.ant-input-lg {
        padding: 6.5px 11px;
    }
    &.ant-input-affix-wrapper-sm,
    &.ant-input-sm {
        padding: 4px 7px;
    }
`;

export default Input;
