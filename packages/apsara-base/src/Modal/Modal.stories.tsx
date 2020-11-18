import React from "react";

import Modal from "./Modal";

export default {
    title: "General/Modal",
    component: Modal,
};

export const left = () => (
    <>
        <Modal open type="left">
            <h1>Left Modal</h1>
        </Modal>
    </>
);

export const right = () => (
    <>
        <Modal open>
            <h1>Right Modal</h1>
        </Modal>
    </>
);
