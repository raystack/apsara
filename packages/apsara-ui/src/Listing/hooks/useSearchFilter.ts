import { useState, useCallback } from "react";
import { getFilterList } from "../helpers";
import * as R from "ramda";
import { IGroupOptions } from "../Listing.types";

export const useSearchFilterState = () => {
    const [filteredFieldData, setFilteredFieldData] = useState({}); // for updating UI
    const [triggerFieldData, setTriggerFieldData] = useState({}); // for triggering filter function
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedInfo, setSortedInfo] = useState({});
    const [savedFilterWithBtn, setSavedFilterWithBtn] = useState({}); // save all incoming filter data wrt btn
    const [tempCachedFilter, setTempCachedFilter] = useState({}); // temp state for all incoming data

    const onGroupFilter = (group: IGroupOptions, filteredArr: any, withBtn: boolean) => {
        const { slug, multi = true } = group;
        const temp = { [slug]: multi ? filteredArr : R.takeLast(1, filteredArr) };
        const cacheFilter = {
            ...filteredFieldData,
            ...temp,
        };
        const tempFilterWithBtn = {
            ...tempCachedFilter,
            ...temp,
        };
        if (!multi) {
            tempFilterWithBtn[slug] = R.takeLast(1, filteredArr);
        }
        setTempCachedFilter(tempFilterWithBtn);
        if (!withBtn) {
            setFilteredFieldData(cacheFilter);
            setTriggerFieldData(cacheFilter);
        } else if (withBtn && !multi) {
            setFilteredFieldData(cacheFilter);
            setSavedFilterWithBtn(tempFilterWithBtn);
        } else if (withBtn && multi) {
            setFilteredFieldData(tempFilterWithBtn);
            setSavedFilterWithBtn(tempFilterWithBtn);
        }
    };

    const onApplyBtn = () => {
        setFilteredFieldData(savedFilterWithBtn);
        setTriggerFieldData(savedFilterWithBtn);
    };

    const onClearGroupFilter = () => {
        setFilteredFieldData({});
        setTriggerFieldData({});
        setTempCachedFilter({});
        setSavedFilterWithBtn({});
    };

    return {
        sortedInfo,
        searchTerm,
        filteredFieldData,
        triggerFieldData,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
        onApplyBtn,
    };
};

export default function useSearchFilter({ list, searchFields = [] }: any) {
    const {
        sortedInfo,
        searchTerm,
        filteredFieldData,
        triggerFieldData,
        setSearchTerm,
        setSortedInfo,
        onGroupFilter,
        onClearGroupFilter,
        onApplyBtn,
    } = useSearchFilterState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filteredList = useCallback(getFilterList(list, triggerFieldData, searchTerm, searchFields), [
        list,
        searchTerm,
        triggerFieldData,
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
        onApplyBtn,
    };
}
