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
    background: "none",

    userSelect: "none",
    outline: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "$1",
    zIndex: "10",
});

const StyledTabsList = styled(TabsPrimitive.List, {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    padding: 0,
    gap: "$1",
    borderRadius: "$1",

    "&:focus": {
        outline: "none",
    },
    '&[data-orientation="vertical"]': {
        flexDirection: "column",
    },

    button: {
        color: "$fgMuted",
    },

    'button[data-state="active"]': {
        background: "$bgInset",
        color: "$fgBase",
    },

    'button[data-orientation="vertical"]': {
        justifyContent: "flex-start",

        '&[data-state="active"]': {
            background: "$bgInset",
            color: "$fgBase",
        },
    },

    variants: {
        underline: {
            true: {
                'button[data-state="active"]': {
                    background: "none",
                    color: "$fgAccent",
                },

                'button[data-orientation="vertical"]': {
                    justifyContent: "flex-start",

                    '&[data-state="active"]': {
                        background: "none",
                        color: "$fgAccent",
                    },
                },
            },
        },

        elevated: {
            true: {
                padding: "2px",
                background: "$bgInset",

                'button[data-state="active"]': {
                    background: "$bgBase",
                    boxShadow: "$sm",
                    color: "$fgBase",
                },

                'button[data-orientation="vertical"]': {
                    justifyContent: "flex-start",

                    '&[data-state="active"]': {
                        background: "$bgBase",
                        boxShadow: "$sm",
                        color: "$fgBase",
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
