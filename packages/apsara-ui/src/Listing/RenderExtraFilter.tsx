import React from "react";
import CustomIcon from "../Icon";
import { FilterActions } from "./Listing.styles";

const getColor = (active: string, type: string) => {
    return active === type ? "#4c4c4c" : "rgba(76, 76, 76, .40)";
};

/*
icons = [{
  name: 'custom icons name',
  url: '/URL'
}]
*/

const RenderExtraFilters = ({ active, icons = [], onClick }: any) => {
    return (
        <FilterActions>
            {icons.map((icon: any) => (
                <CustomIcon
                    key={icon.name}
                    styleOverride={{ color: getColor(active, icon.name) }}
                    name={icon.name}
                    onClick={() => onClick(icon.url)}
                />
            ))}
        </FilterActions>
    );
};

export default RenderExtraFilters;
