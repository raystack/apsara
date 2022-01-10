import React from "react";
import { Select as AntdSelect } from "antd";
import styled from "styled-components";
import { textStyles } from "../mixin";

const StyledSelect = styled(({ className, selectClassName, ...props }) => (
    <AntdSelect {...props} dropdownClassName={className} className={selectClassName} />
))`
    &.ant-select-dropdown {
        color: ${({ theme }) => theme?.colors?.black[10]};
        background-color: ${({ theme }) => theme?.colors?.black[0]};
    }
    &.ant-select-dropdown-empty {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-select-item-empty {
        color: ${({ theme }) => theme?.colors?.black[10]};
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-select-item {
        color: ${({ theme }) => theme?.colors?.black[10]};
    }
    .ant-select-item-group {
        color: ${({ theme }) => theme?.colors?.black[7]};
    }
    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
        background-color: ${({ theme }) => theme?.colors?.black[2]};
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        color: ${({ theme }) => theme?.colors?.black[10]};
        background-color: ${({ theme }) => theme?.colors?.black[4]};
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state {
        color: ${({ theme }) => theme?.colors?.primary[4]};
    }
    .ant-select-item-option-disabled {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-select-item-option-disabled.ant-select-item-option-selected {
        background-color: ${({ theme }) => theme?.colors?.black[2]};
    }
`;

const Select = styled(({ className, ...props }) => <StyledSelect {...props} selectClassName={className} />)`
    &.ant-select-single.ant-select-open .ant-select-selection-item {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    &.ant-select-disabled.ant-select-multiple .ant-select-selector {
        background: ${({ theme }) => theme?.colors?.black[2]};
    }
    &.ant-select-multiple .ant-select-selection-item {
        height: 21px;
        display: flex;
        align-items: center;
        background: ${({ theme }) => theme?.colors?.black[2]};
        border-color: ${({ theme }) => theme?.colors?.black[3]};
        border-radius: 10.5px;
        border: 0;
        ${({ theme }) => textStyles("10px", theme?.colors?.black[10], "0.25px")}
    }
    &.ant-select-disabled.ant-select-multiple .ant-select-selection-item {
        color: ${({ theme }) => theme?.colors?.black[6]};
        border-color: ${({ theme }) => theme?.colors?.black[4]};
    }
    &.ant-select-multiple .ant-select-selection-item-remove {
        color: ${({ theme }) => theme?.colors?.black[7]};
    }
    &.ant-select-multiple .ant-select-selection-item-remove:hover {
        color: ${({ theme }) => theme?.colors?.black[9]};
    }
    &.ant-select {
        color: ${({ theme }) => theme?.colors?.black[10]};
    }
    &:not(.ant-select-customize-input) .ant-select-selector {
        background-color: ${({ theme }) => theme?.colors?.black[0]};
        border-color: ${({ theme }) => theme?.colors?.black[4]};
        height: 32px;

        &::after,
        .ant-select-selection-item,
        .ant-select-selection-placeholder {
            line-height: 30px;
        }
        .ant-select-selection-search-input {
            height: 30px;
        }
    }
    &.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
        border-color: ${({ theme }) => theme?.colors?.primary[5]};
    }
    &.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
        color: ${({ theme }) => theme?.colors?.black[6]};
        background: ${({ theme }) => theme?.colors?.black[2]};
    }
    &.ant-select-multiple.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
        background: ${({ theme }) => theme?.colors?.black[2]};
    }
    &.ant-select:not(.ant-select-disabled):hover .ant-select-selector {
        border-color: ${({ theme }) => theme?.colors?.primary[5]};
    }
    .ant-select-selection-placeholder {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-select-arrow {
        color: ${({ theme }) => theme?.colors?.black[6]};
    }
    .ant-select-clear {
        color: ${({ theme }) => theme?.colors?.black[6]};
        background: ${({ theme }) => theme?.colors?.black[0]};
    }
    .ant-select-clear:hover {
        color: ${({ theme }) => theme?.colors?.black[7]};
    }

    &.ant-select-lg:not(.ant-select-customize-input) .ant-select-selector {
        height: 40px;

        &::after,
        .ant-select-selection-item,
        .ant-select-selection-placeholder {
            line-height: 38px;
        }
        .ant-select-selection-search-input {
            height: 38px;
        }
    }
    &.ant-select-sm:not(.ant-select-customize-input) .ant-select-selector {
        height: 24px;

        &::after,
        .ant-select-selection-item,
        .ant-select-selection-placeholder {
            line-height: 22px;
        }
        .ant-select-selection-search-input {
            height: 22px;
        }
    }
`;

export default Select;
