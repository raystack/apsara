import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import Input from "../Input";
import { SizeType } from "antd/lib/config-provider/SizeContext";

import CustomIcon, { IconName } from "../Icon/Icon";
import { Wrapper } from "./Search.styles";

const nullFn = () => null;

export interface SearchProps {
    placeholder?: string;
    onChange?: (data: any) => void;
    children?: any;
    className?: string;
    value?: string;
    style?: any;
    secondary?: false;
    size?: SizeType;
    onFocus?: () => null;
    onKeyDown?: () => null;
    inputId?: string;
    autoComplete?: string;
    iconStyle?: any;
    onIconClick?: () => null;
    disabled?: boolean;
}
const Search = ({
    placeholder = "Search list items",
    onChange,
    children,
    className,
    value,
    style = {},
    secondary = false,
    size = "small",
    onFocus = nullFn,
    onKeyDown = nullFn,
    inputId = "",
    autoComplete = "off",
    iconStyle = {},
    onIconClick = nullFn,
    disabled = false,
}: SearchProps) => {
    const theme = useContext(ThemeContext);
    const iconObj = secondary
        ? { name: "search" as IconName, color: theme?.colors?.black[6] }
        : { name: "searchfilter" as IconName, color: theme?.colors?.black[7] };
    const isIconClickFn = typeof onIconClick === "function";

    const handleIconClick = () => {
        isIconClickFn && onIconClick();
    };

    return (
        <Wrapper className={className} secondary={secondary} style={style}>
            <Input
                disabled={disabled}
                size={size}
                allowClear
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={onFocus}
                id={inputId}
                onKeyDown={onKeyDown}
                autoComplete={autoComplete}
            />
            <CustomIcon
                disabled={disabled}
                styleOverride={{
                    fontSize: theme?.fontSizes[2],
                    color: iconObj.color,
                    cursor: isIconClickFn ? "pointer" : "initial",
                    ...iconStyle,
                }}
                name={iconObj.name}
                onClick={handleIconClick}
            />
            {children}
        </Wrapper>
    );
};

export default Search;
