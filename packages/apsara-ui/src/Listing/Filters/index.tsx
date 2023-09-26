/* eslint-disable */

import React, { useEffect, useState } from "react";
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
import Input from "../../Input";

const renderFilterList = ({
    filterFieldList,
    filteredFieldData,
    filteredFieldDataLength,
    onGroupFilter,
    onClearGroupFilter,
    onApplyClick,
    open,
}: any) => {
    return (
        <FilterPopup>
            <FilterBody>
                {filterFieldList.map((group: any, index: number) => (
                    <RenderFilterBodyColumn
                        key={index}
                        group={group}
                        filteredFieldData={filteredFieldData}
                        onGroupFilter={onGroupFilter}
                        open={open}
                    />
                ))}
            </FilterBody>
            <FilterFooter>
                <span onClick={onClearGroupFilter} className={`clear-btn ${filteredFieldDataLength ? "" : "disabled"}`}>
                    Clear All Filters
                </span>
                {onApplyClick && (
                    <Button type="default" onClick={onApplyClick} className="apply-btn">
                        Apply
                    </Button>
                )}
            </FilterFooter>
        </FilterPopup>
    );
};

const RenderFilterBodyColumn = ({ group, filteredFieldData, onGroupFilter, open }: any) => {
    const [filterSearch, setFilterSearch] = useState("");

    useEffect(() => {
        setFilterSearch("");
    }, [open]);

    return (
        <FilterColumn key={group.name}>
            <FilterTitle>{group.name}</FilterTitle>
            {group.searchEnabled && (
                <Input
                    size="small"
                    onChange={(e: any) => setFilterSearch(e.target.value)}
                    placeholder="search"
                    value={filterSearch[group.name]}
                ></Input>
            )}
            <div>
                <Checkbox.Group
                    value={filteredFieldData[group.slug] || []}
                    onChange={(args: any) => onGroupFilter(group, args)}
                    options={group.data.filter((option: any) =>
                        option.label.toLowerCase().match(filterSearch.toLowerCase()),
                    )}
                    orientation="vertical"
                />
            </div>
        </FilterColumn>
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
                            {open ? <CaretUpIcon /> : <CaretDownIcon />}
                        </FilterButton>
                    </StyledBadge>
                </span>
            </PopoverTrigger>
            <PopoverPrimitive.Portal>
                <StyledContent side="bottom" align="end">
                    {renderFilterList({ filteredFieldData, filteredFieldDataLength, open, ...props })}
                    <StyledArrow />
                </StyledContent>
            </PopoverPrimitive.Portal>
        </StyledPopover>
    );
};

export default Filters;
