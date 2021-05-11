import styled, { css } from "styled-components";

const baseButtonStyles = css`
    display: inline-flex;
    align-items: center;
    margin: 8px 0;
    font-weight: bold;
    cursor: pointer;

    .anticon {
        margin-right: 4px;
    }
`;

export const DynamicListContainer = styled.div`
    .form-dynamic-list__item {
        display: flex;
        .ant-form-item {
            margin-right: 24px;
        }
    }

    .form-dynamic-list__btn-add {
        display: inline-flex;
        ${baseButtonStyles}
    }

    .form-dynamic-list__btn-remove {
        color: red;
        margin-left: 20px;
        ${baseButtonStyles}
    }
`;
