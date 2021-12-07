/* eslint-disable */

import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import Checkbox from "../../Checkbox";
import { StyledPopover } from "../../Popover/Popover.styles";
import {
    FilterPopup,
    FilterBody,
    FilterColumn,
    FilterTitle,
    FilterLabel,
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
                            >
                                {group.data.map((obj: any) => (
                                    <FilterLabel key={obj.value}>
                                        <Checkbox value={obj.value}>{obj.label}</Checkbox>
                                    </FilterLabel>
                                ))}
                            </Checkbox.Group>
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
    const [visible, setVisible] = useState(false);
    const filteredFieldDataLength = Object.keys(filteredFieldData).reduce((acc, key) => {
        return acc + filteredFieldData[key].length;
    }, 0);

    return (
        <StyledPopover
            visible={visible}
            onVisibleChange={setVisible}
            trigger="click"
            placement="bottomRight"
            content={renderFilterList({ filteredFieldData, filteredFieldDataLength, ...props })}
        >
            <StyledBadge dot={!!filteredFieldDataLength}>
                <FilterButton type="default" disabled={disabled}>
                    {label}
                    <CaretDownFilled className={visible ? "rotate" : ""} style={{ fontSize: "10px" }} />
                </FilterButton>
            </StyledBadge>
        </StyledPopover>
    );
};

export default Filters;
