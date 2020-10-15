import * as R from "ramda";

export const getStringValue = (value: any): string => {
    if (typeof value === "boolean") {
        return value.toString();
    }
    return value && typeof value !== "string" ? value.toString() : value;
};

const getOperator = R.cond([
    [R.equals("Eq"), R.always(R.equals)],
    [R.equals("NotEq"), R.always(R.complement(R.equals))],
    [R.T, R.T],
]);

export const evaluateExpression = ({ operator, value }: any, fieldValue: any) => {
    const operatorFn = getOperator(operator);
    return operatorFn(fieldValue, value);
};
