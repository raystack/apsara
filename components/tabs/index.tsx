import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";
import { CSS, styled } from "../../stitches.config";

const TabsRoot = styled(TabsPrimitive.Root, {
    display: "flex",
    '&[data-orientation="horizontal"]': {
        flexDirection: "column",
    },
});

const TabsTrigger = styled(TabsPrimitive.Trigger, {
    flexShrink: 0,
    border: "none",
    display: "inline-flex",
    fontSize: "$2",
    lineHeight: "16px",
    px: "$2",
    py: "$1",

    userSelect: "none",
    outline: "none",
    alignItems: "center",
    justifyContent: "center",
    color: "$fgBase",
    borderRadius: "$1",
    zIndex: "10",

    "@hover": {
        "&:hover": {
            color: "$fgSubtle",
        },
    },

    '&[data-state="active"]': {
        background: "$bgBase",
        color: "$fgBase",
        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
    },

    '&[data-orientation="vertical"]': {
        justifyContent: "flex-start",

        '&[data-state="active"]': {
            background: "$bgSubtle",
            color: "$fgBase",
            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
        },
    },
});

const StyledTabsList = styled(TabsPrimitive.List, {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    padding: "2px",
    gap: "$1",
    background: "$bgBase",
    borderRadius: "$1",
    "&:focus": {
        outline: "none",
    },
    '&[data-orientation="vertical"]': {
        flexDirection: "column",
    },

    variants: {
        pill: {
            true: {
                padding: 0,
                background: "$bgBase",
                button: {
                    background: "$bgBase",
                },

                'button[data-state="active"]': {
                    background: "$bgSubtle",
                    color: "$fgSubtle",
                },

                'button[data-orientation="vertical"]': {
                    justifyContent: "flex-start",

                    '&[data-state="active"]': {
                        background: "$bgSubtle",
                        color: "$fbSubtle",
                    },
                },
            },
        },
    },
});

type TabsListPrimitiveProps = React.ComponentProps<typeof TabsPrimitive.List>;
type TabsListProps = TabsListPrimitiveProps & { css?: CSS; pill?: boolean };

const TabsList = React.forwardRef<React.ElementRef<typeof StyledTabsList>, TabsListProps>((props, forwardedRef) => (
    <>
        <StyledTabsList {...props} ref={forwardedRef} />
    </>
));

const TabsContent = styled(TabsPrimitive.Content, {
    flexGrow: 1,
    "&:focus": {
        outline: "none",
    },
});

export const Tabs = Object.assign(TabsRoot, {
    Trigger: TabsTrigger,
    Content: TabsContent,
    List: TabsList,
});
