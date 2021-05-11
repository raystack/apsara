import * as R from "ramda";

export interface Field {
    name: string | string[];
    key?: string;
    value?: string;
    initialValue?: string;
    dependencies?: string[];
}
export const getDependenciesFieldNamepath = (meta: any, listIndex: number, currentFormField: Field) => {
    const listBaseNamepath = meta.name;
    const allFormFieldNamepaths = meta.fields.map((metaField: Field) => metaField.name);

    const shouldAddListIndexToDependencies =
        R.has("dependencies", currentFormField) &&
        R.isEmpty(R.difference(currentFormField?.dependencies || [], allFormFieldNamepaths));

    if (shouldAddListIndexToDependencies) {
        return (currentFormField.dependencies || []).map((dependency) => [listBaseNamepath, listIndex, ...dependency]);
    }

    return [];
};

export const getFormListItemFields = (listIndex: any, meta: any) => {
    return meta.fields.map((metaField: Field) =>
        R.pipe(
            R.assocPath(["name"], [listIndex, ...metaField.name]),
            R.assocPath(["dependencies"], getDependenciesFieldNamepath(meta, listIndex, metaField)),
        )(metaField),
    );
};
