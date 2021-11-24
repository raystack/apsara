import { Radio as AntdRadio } from "antd";
import styled, { css } from "styled-components";

const radioStyles = css`
    color: ${({ theme }) => theme?.colors?.black[10]};
    .ant-radio {
        color: ${({ theme }) => theme?.colors?.black[10]};
    }
    :hover .ant-radio,
    .ant-radio:hover .ant-radio-inner,
    .ant-radio-input:focus + .ant-radio-inner {
        border-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-radio-checked::after {
        display: none;
    }
    .ant-radio-inner {
        background-color: ${({ theme }) => theme?.colors?.black[0]};
        border-color: ${({ theme }) => theme?.colors?.black[5]};
    }
    .ant-radio-inner::after {
        background-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-radio-input:focus + .ant-radio-inner {
        box-shadow: none;
    }
    .ant-radio-checked .ant-radio-inner {
        border-color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-radio-disabled .ant-radio-inner {
        background-color: ${({ theme }) => theme?.colors?.black[2]};
        border-color: ${({ theme }) => theme?.colors?.black[5]} !important;
    }
    .ant-radio-disabled .ant-radio-inner::after {
        background-color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-radio-disabled + span {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
`;

// TODO: fix the Group type
const Radio: typeof AntdRadio & { Group: any } = styled(AntdRadio)`
    ${radioStyles}
`;

const RadioGroup = styled(AntdRadio.Group)`
    color: ${({ theme }) => theme?.colors?.black[10]};
    .ant-radio-wrapper {
        ${radioStyles}
    }
`;

Radio.Group = RadioGroup;

export default Radio;
