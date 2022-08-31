/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";

import Popover from "./Popover";
import Button from "../Button";
import Input from "../Input";

export default {
    title: "General/Popover",
    component: Popover,
};

export const popover = () => (
    <>
        <Popover title="Confirmation" message="please confirm" onOk={() => {}}>
            <Button>Default Button</Button>
        </Popover>
    </>
);

export const popoverContent = () => (
    <>
        <Popover
            title="Confirmation"
            content={
                <div>
                    <Input />
                </div>
            }
            onOk={() => {}}
            cancelBtnProps={{
                text: "Cancel",
                style: { marginLeft: "10px" },
            }}
        >
            <Button>Default Button</Button>
        </Popover>
    </>
);
