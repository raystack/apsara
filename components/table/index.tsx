import { styled } from "~/stitches.config";

const SimpleCaption = styled("caption", {
    textAlign: "start",
    marginBottom: "$5",
});

const SimpleTbody = styled("tbody", {
    width: "100%",
});

const SimpleTfoot = styled("tfoot", {});

const SimpleTr = styled("tr", {});

const SimpleTh = styled("th", {
    fontWeight: "unset",
    textAlign: "start",
    fontSize: "$2",
    py: "$3",
    borderBottom: "1px solid $gray4",
    variants: {
        align: {
            start: {
                textAlign: "start",
            },
            center: {
                textAlign: "center",
            },
            end: {
                textAlign: "end",
            },
        },
        border: {
            solid: {
                borderBottom: "1px solid $gray4",
            },
            dashed: {
                borderBottom: "1px dashed $gray8",
            },
        },
    },
    defaultVariants: {
        align: "start",
        border: "solid",
    },
});

const SimpleTd = styled("td", {
    py: "$3",
    borderBottom: "1px solid $gray4",
    fontSize: "$2",
    lineHeight: "$1",
    variants: {
        align: {
            start: {
                textAlign: "start",
            },
            center: {
                textAlign: "center",
            },
            end: {
                textAlign: "end",
            },
        },
        border: {
            solid: {
                borderBottom: "1px solid $gray4",
            },
            dashed: {
                borderBottom: "1px dashed $gray8",
            },
        },
    },
    defaultVariants: {
        align: "start",
        border: "solid",
    },
});

const SimpleThead = styled("thead", {
    [`& ${SimpleTh}`]: {
        fontSize: "$1",
        color: "$gray11",
    },
    [`& ${SimpleTd}`]: {
        fontSize: "$1",
        color: "$gray11",
    },
});

const SimpleTableRoot = styled("table", {
    width: "100%",
    tableLayout: "fixed",
    borderSpacing: 0,
    variants: {
        striped: {
            true: {
                [`& ${SimpleTbody}`]: {
                    [`& ${SimpleTr}`]: {
                        "&:nth-child(odd)": {
                            bc: "$gray2",
                        },
                    },
                },
            },
        },
    },
});

export { useTable } from "./hooks/useTable";
export { Table } from "./Table";

export const SimpleTable = Object.assign(SimpleTableRoot, {
    Thead: SimpleThead,
    Td: SimpleTd,
    Th: SimpleTh,
    Tr: SimpleTr,
    Body: SimpleTbody,
    Footer: SimpleTfoot,
    Caption: SimpleCaption,
});
