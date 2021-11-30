import { Checkbox as AntdCheckbox } from "antd";
import styled, { css } from "styled-components";

const checkboxStyles = css`
    color: ${({ theme }) => theme?.colors?.black[10]};
    .ant-checkbox {
        color: ${({ theme }) => theme?.colors?.black[10]};
    }
    :hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-checkbox-checked::after {
        border-color: ${({ theme }) => theme?.colors?.primary[4]};
        animation: none;
    }
    .ant-checkbox-inner {
        background-color: ${({ theme }) => theme?.colors?.black[0]};
        border-color: ${({ theme }) => theme?.colors?.black[5]};
    }
    .ant-checkbox-inner::after {
        border-color: ${({ theme }) => theme?.colors?.black[0]};
    }
    .ant-checkbox-checked .ant-checkbox-inner::after {
        border-color: ${({ theme }) => theme?.colors?.black[0]};
    }
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${({ theme }) => theme?.colors?.primary[4]};
        border-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
        border-color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-checkbox-disabled .ant-checkbox-inner {
        background-color: ${({ theme }) => theme?.colors?.black[2]};
        border-color: ${({ theme }) => theme?.colors?.black[5]} !important;
    }
    .ant-checkbox-disabled .ant-checkbox-inner::after {
        border-color: ${({ theme }) => theme?.colors?.black[2]};
    }
    .ant-checkbox-disabled + span {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-checkbox-indeterminate .ant-checkbox-inner {
        background-color: ${({ theme }) => theme?.colors?.black[0]};
        border-color: ${({ theme }) => theme?.colors?.black[5]};
    }
    .ant-checkbox-indeterminate .ant-checkbox-inner::after {
        background-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-checkbox-indeterminate.ant-checkbox-disabled .ant-checkbox-inner::after {
        background-color: ${({ theme }) => theme?.colors?.black[6]};
        border-color: ${({ theme }) => theme?.colors?.black[6]};
    }
`;

// TODO: fix the Group type
const Checkbox: typeof AntdCheckbox & { Group: any } = styled(AntdCheckbox)`
    ${checkboxStyles}
`;

const CheckboxGroup = styled(AntdCheckbox.Group)`
    color: ${({ theme }) => theme?.colors?.black[10]};
    .ant-checkbox-wrapper {
        ${checkboxStyles}
    }
`;

Checkbox.Group = CheckboxGroup;

export default Checkbox;
