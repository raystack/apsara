import React from "react";
import { SelectProps, OptGroup, Option } from "rc-select";
import { NotFoundContent, StyledMultiSelect } from "./Combobox.styles";
import { useState } from "react";
import Icon from "../Icon";

const SearchIcon = <Icon name="search" size={20} color="#aaa" />;
const ArrowIcon = <Icon name="chevronright" color="#aaa" />;
const notFoundContent = (
    <NotFoundContent>
        <Icon name="ratingTwo" color="#36CEC2" size={30} />
        <div style={{ fontSize: 15 }}>Not Found</div>
    </NotFoundContent>
);

const Combobox = ({
    options,
    mode,
    value,
    onChange,
    onSearch,
    onSelect,
    onDeselect,
    allowClear = true,
    showSearch = true,
    showArrow = true,
    placeholder,
    optionFilterProp,
    ...props
}: SelectProps) => {
    const [showInputIcon, setShowInputIcon] = useState(true);
    const [isValue, setIsValue] = useState(false);
    const [inputIcon, setInputIcon] = useState(ArrowIcon);
    const [open, setOpen] = useState(false);

    const onValuesChange = (value: any, option: any) => {
        if (!value || value.length == 0) {
            setShowInputIcon(true);
            setIsValue(false);
        } else {
            setShowInputIcon(false);
            setIsValue(true);
        }
        onChange && onChange(value, option);
    };

    const onValueSearch = (value: string) => {
        if (value) setShowInputIcon(false);
        else setShowInputIcon(!isValue);
        onSearch && onSearch(value);
    };

    const onDropDownToogle = (open: boolean) => {
        setOpen(open);
        if (!open) setInputIcon(ArrowIcon);
        else setInputIcon(SearchIcon);
    };

    const onValueSelect = (value: any, option: any) => {
        onSelect && onSelect(value, option);
    };
    const onValueDeselect = (value: any, option: any) => {
        onDeselect && onDeselect(value, option);
    };

    return (
        <StyledMultiSelect
            notFoundContent={notFoundContent}
            {...props}
            showInputIcon={showInputIcon || !allowClear}
            showSearch={showSearch}
            mode={mode}
            allowClear={allowClear}
            placeholder={placeholder}
            value={value}
            showArrow={showArrow}
            inputIcon={inputIcon}
            onChange={onValuesChange}
            onSearch={onValueSearch}
            onDropdownVisibleChange={onDropDownToogle}
            open={open}
            onSelect={onValueSelect}
            onDeselect={onValueDeselect}
            options={options}
            filterOption={true}
            optionFilterProp={optionFilterProp || "value"}
            animation="slide"
        >
            {props.children}
        </StyledMultiSelect>
    );
};

Combobox.Option = Option;
Combobox.OptGroup = OptGroup;

export default Combobox;
