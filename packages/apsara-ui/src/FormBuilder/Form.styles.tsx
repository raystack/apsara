import styled from "styled-components";
import { textStyles } from "../mixin";
import { Form } from "antd";

export const StyledForm: typeof Form = styled(Form)`
    ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.colors?.black[9])}

    .ant-col,
    .ant-picker {
        width: 100%;
    }

    .ant-form-item {
        .ant-form-item-label {
            padding-bottom: 6px;

            label {
                font-size: ${({ theme }) => theme?.fontSizes[0]};
                text-transform: uppercase;
                color: ${({ theme }) => theme?.colors?.black[9]};
            }

            label[class="ant-form-item-required"]::before {
                display: none;
            }
        }
    }
`;
