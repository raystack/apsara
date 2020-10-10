import { useState, useCallback } from "react";
import { getFilterList } from "./utils";

export const useSearchFilterState = () => {
    const [filteredFieldData, setFilteredFieldData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedInfo, setSortedInfo] = useState({});

    const onGroupFilter = (group: any, filteredArr: any) => {
        setFilteredFieldData({ ...filteredFieldData, ...{ [group.slug]: filteredArr } });
    };

    const onClearGroupFilter = () => setFilteredFieldData({});

    return {
        sortedInfo,
        searchTerm,
        filteredFieldData,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
    };
};

export default function useSearchFilter({ list, searchFields = [] }: any) {
    const {
        sortedInfo,
        searchTerm,
        filteredFieldData,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
    } = useSearchFilterState();

    const filteredList = useCallback(getFilterList(list, filteredFieldData, searchTerm, searchFields), [
        list,
        searchTerm,
        filteredFieldData,
        searchFields,
    ]);

    return {
        sortedInfo,
        searchTerm,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
        filteredList,
        filteredFieldData,
    };
}
