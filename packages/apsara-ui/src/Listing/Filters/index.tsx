/* eslint-disable */

import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Checkbox, Popover, Button, Badge } from "antd";
import "./filters.less";

const renderFilterList = ({
    filterFieldList,
    filteredFieldData,
    filteredFieldDataLength,
    onGroupFilter,
    onClearGroupFilter,
}: any) => {
    return (
        <div className="filter__popup">
            <div className="filter__popup--body">
                {filterFieldList.map((group: any) => (
                    <div className="filter__popup--column" key={group.name}>
                        <div className="filter__popup--title">{group.name}</div>
                        <div>
                            <Checkbox.Group
                                value={filteredFieldData[group.slug] || []}
                                onChange={(args) => onGroupFilter(group, args)}
                            >
                                {group.data.map((obj: any) => (
                                    <div className="filter__popup--label" key={obj.value}>
                                        <Checkbox value={obj.value}>{obj.label}</Checkbox>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                ))}
            </div>
            <div className="filter__popup-footer">
                <span onClick={onClearGroupFilter} className={`${filteredFieldDataLength ? "" : "disabled"}`}>
                    Clear All Filters
                </span>
            </div>
        </div>
    );
};

const Filters = ({ filteredFieldData, label = "Filters", disabled = false, ...props }: any) => {
    const [visible, setVisible] = useState(false);
    const filteredFieldDataLength = Object.keys(filteredFieldData).reduce((acc, key) => {
        return acc + filteredFieldData[key].length;
    }, 0);

    return (
        <Popover
            visible={visible}
            onVisibleChange={setVisible}
            trigger="click"
            placement="bottomRight"
            content={renderFilterList({ filteredFieldData, filteredFieldDataLength, ...props })}
        >
            <Badge dot={!!filteredFieldDataLength}>
                <Button type="default" className="btn-filter" disabled={disabled}>
                    {label}
                    <CaretDownFilled className={visible ? "rotate" : ""} style={{ fontSize: "10px" }} />
                </Button>
            </Badge>
        </Popover>
    );
};

export default Filters;
