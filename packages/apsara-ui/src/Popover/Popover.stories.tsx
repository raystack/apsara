/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";

import Popover from "./Popover";
import Button from "../Button";

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
                    <input></input>
                </div>
            }
            onOk={() => {}}
            cancelBtnProps={{
                text: "Cancel",
            }}
        >
            <Button>Default Button</Button>
        </Popover>
    </>
);
