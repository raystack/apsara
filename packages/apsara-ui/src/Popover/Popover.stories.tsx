/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from "react";

import Popover from "./Popover";
import Button from "../Button";
import Input from "../Input";

export default {
    title: "General/Popover",
    component: Popover,
};

export const popoverContent = () => {
    const [val, setVal] = useState<string | number | readonly string[] | undefined>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };
    return (
        <>
            <Popover
                title="Confirmation"
                content={
                    <div>
                        <Input value={val} onChange={onChange} />
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
};

export const popoverContentParam = () => {
    const [open, setOpen] = useState(false);
    const [val, setVal] = useState<string | number | readonly string[] | undefined>("");
    const onChange: React.FormEventHandler<HTMLInputElement> = (event: any) => {
        setVal(event.target.value);
    };
    return (
        <>
            <Popover
                title="Confirmation"
                content={
                    <div>
                        <Input value={val} onChange={onChange} />
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
