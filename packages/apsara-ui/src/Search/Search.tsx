import React from "react";
import { Input } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";

import CustomIcon, { IconName } from "../Icon/Icon";
import Theme from "../theme";
import "./search.less";

const PRIMARY_SEARCH_ICON_COLOR = Theme["@outline-color"];
const SECONDARY_SEARCH_ICON_COLOR = Theme["@table-header-color"];
const ICON_SIZE = Theme["@datlantis-font-lg"];
const nullFn = () => null;

interface SearchProps {
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
    const iconObj = secondary
        ? { name: "search" as IconName, color: SECONDARY_SEARCH_ICON_COLOR }
        : { name: "searchfilter" as IconName, color: PRIMARY_SEARCH_ICON_COLOR };
    const isIconClickFn = typeof onIconClick === "function";

    const handleIconClick = () => {
        isIconClickFn && onIconClick();
    };

    return (
        <div className={`search__wrapper ${className} ${secondary && "secondary"}`} style={style}>
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
                    fontSize: ICON_SIZE,
                    color: iconObj.color,
                    cursor: isIconClickFn ? "pointer" : "initial",
                    ...iconStyle,
                }}
                name={iconObj.name}
                onClick={handleIconClick}
            />
            {children}
        </div>
    );
};
export default Search;
