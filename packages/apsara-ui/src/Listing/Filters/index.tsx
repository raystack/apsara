/* eslint-disable */

import React, { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
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
import Button from "../../Button";

const renderFilterList = ({
    filterFieldList,
    filteredFieldData,
    filteredFieldDataLength,
    onGroupFilter,
    onClearGroupFilter,
    onApplyClick,
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
                <span onClick={onClearGroupFilter} className={`clear-btn ${filteredFieldDataLength ? "" : "disabled"}`}>
                    Clear All Filters
                </span>
                {onApplyClick &&
                    <Button type="default" onClick={onApplyClick} className="apply-btn">Apply</Button>
                }
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
                    <StyledBadge dot={!!filteredFieldDataLength} >
                        <FilterButton type="default" disabled={disabled}>
                            {label}
                            {open ? <CaretUpIcon/> :  <CaretDownIcon/>}
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
