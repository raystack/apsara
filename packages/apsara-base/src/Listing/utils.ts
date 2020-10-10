// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as R from "ramda";
export const getStringValue = (value: any) => {
    if (typeof value === "boolean") {
        return value.toString();
    }
    return value && typeof value !== "string" ? value.toString() : value;
};

export const getFilterList = (data: any, filterItemMap = {}, searchTerm: string, searchFields = []) => {
    const slugs = Object.keys(filterItemMap);
    const searchTermLowerCase = searchTerm && searchTerm.toLowerCase();

    const search = (value: any) => getStringValue(value).toLowerCase().includes(searchTermLowerCase);

    const safeSearch = (s: string) => {
        return R.curry(R.pipe(R.pathOr(""), search))(R.split(".", s));
    };

    const groupFilterByCategory = (category: string) => (item: any) =>
        filterItemMap[category].length ? filterItemMap[category].includes(R.path(R.split(".", category), item)) : true;

    const groupFilter = slugs.length ? R.allPass(slugs.map(groupFilterByCategory)) : () => true;
    const searchFilter = searchFields.length ? R.anyPass(searchFields.map(safeSearch)) : () => true;

    return data.filter(R.both(groupFilter, searchFilter));
};
