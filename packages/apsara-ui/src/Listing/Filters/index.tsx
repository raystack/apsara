/* eslint-disable */

import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import Checkbox from "../../Checkbox";
import { PopoverTrigger, StyledArrow, StyledContent, StyledPopover } from "../../Popover/Popover.styles";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
    FilterPopup,
    FilterBody,
    FilterColumn,
    FilterTitle,
    FilterFooter,
    FilterButton,
    StyledBadge,
} from "./Filters.styles";

const renderFilterList = ({
    filterFieldList,
    filteredFieldData,
    filteredFieldDataLength,
    onGroupFilter,
    onClearGroupFilter,
}: any) => {
    return (
        <FilterPopup>
            <FilterBody>
                {filterFieldList.map((group: any) => (
                    <FilterColumn key={group.name}>
                        <FilterTitle>{group.name}</FilterTitle>
                        <div>
                            <Checkbox.Group
                                value={filteredFieldData[group.slug] || []}
                                onChange={(args: any) => onGroupFilter(group, args)}
                                options={group.data}
                                orientation="vertical"
                            />
                        </div>
                    </FilterColumn>
                ))}
            </FilterBody>
            <FilterFooter>
                <span onClick={onClearGroupFilter} className={`${filteredFieldDataLength ? "" : "disabled"}`}>
                    Clear All Filters
                </span>
            </FilterFooter>
        </FilterPopup>
    );
};

const Filters = ({ filteredFieldData, label = "Filters", disabled = false, ...props }: any) => {
    const [open, setOpen] = useState(false);
    const filteredFieldDataLength = Object.keys(filteredFieldData).reduce((acc, key) => {
        return acc + filteredFieldData[key].length;
    }, 0);

    return (
        <StyledPopover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger asChild>
                <span aria-label="Update dimensions">
                    <StyledBadge dot={!!filteredFieldDataLength}>
                        <FilterButton type="default" disabled={disabled}>
                            {label}
                            <CaretDownFilled className={open ? "rotate" : ""} style={{ fontSize: "10px" }} />
                        </FilterButton>
                    </StyledBadge>
                </span>
            </PopoverTrigger>
            <PopoverPrimitive.Portal>
                <StyledContent side="bottom" align="end">
                    {renderFilterList({ filteredFieldData, filteredFieldDataLength, ...props })}
                    <StyledArrow />
                </StyledContent>
            </PopoverPrimitive.Portal>
        </StyledPopover>
    );
};

export default Filters;
