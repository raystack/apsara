import React from "react";

type ComponentProps = {
    [index: string]: {
        headers: string[];
        rows: Rows;
    };
};

type Rows = Row[];
type Row = Column[];
type Column = {
    type: "code" | "text";
    value: React.ReactNode;
};



const props = {
    button: {
        headers: ["Prop", "Type", "Default", "Description"],
        rows: [
            [
                {
                    type: "text",
                    value: "variant",
                },
                {
                    type: "code",
                    value: "primary | secondry",
                },
                {
                    type: "code",
                    value: "-",
                },
                {
                    type: "text",
                    value: "button type",
                },
            ] as Row,
            
            [
                {
                    type: "text",
                    value: "disabled",
                },
                {
                    type: "code",
                    value: "boolean",
                },
                {
                    type: "code",
                    value: "false",
                },
                {
                    type: "text",
                    value: "disable button",
                },
            ],
            [
                {
                    type: "text",
                    value: "outline",
                },
                {
                    type: "code",
                    value: "boolean",
                },
                {
                    type: "code",
                    value: "false",
                },
                {
                    type: "text",
                    value: "outline button",
                },
            ],
            [
                {
                    type: "text",
                    value: "size",
                },
                {
                    type: "code",
                    value: "small | large | circle",
                },
                {
                    type: "code",
                    value: "-",
                },
                {
                    type: "text",
                    value: "size of button",
                },
            ],
            [
                {
                    type: "text",
                    value: "ref",
                },
                {
                    type: "code",
                    value: "Ref<HTMLButtonElement | null>",
                },
                {
                    type: "code",
                    value: "-",
                },
                {
                    type: "text",
                    value: "forwardRef",
                },
            ],
            [
                {
                    type: "text",
                    value: "...",
                },
                {
                    type: "code",
                    value: "ButtonHTMLAttributes",
                },
                {
                    type: "code",
                    value: "id | className | ...",
                },
                {
                    type: "text",
                    value: "native props	",
                },
            ],
        ] as Rows,
    },
} as ComponentProps
export default props;
