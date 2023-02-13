/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from "react";

import Popover from "./Popover";
import Button from "../Button";
import Input from "../Input";

export default {
    title: "General/Popover",
    component: Popover,
};

export const popoverContent = () => (
    <>
        <Popover
            title="Confirmation"
            content={
                <div>
                    <Input />
                </div>
            }
            okBtnProps={{
                text: "ok",
                style: { marginLeft: "10px" },
            }}
            cancelBtnProps={{
                text: "Cancel",
                style: { marginLeft: "10px" },
            }}
        >
            <Button>Default Button</Button>
        </Popover>
    </>
);

export const popoverContentParam = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Popover
                title="Confirmation"
                content={
                    <div>
                        <Input />
                    </div>
                }
                cancelBtnProps={{
                    text: "Cancel",
                    style: { marginLeft: "10px" },
                }}
                open={open}
                onOpenChange={setOpen}
            >
                <Button>Default Button</Button>
            </Popover>
        </>
    );
};
