/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from "react";

import ConfirmModal from "./ConfirmModal";
import Button from "../Button";
import { Radio } from "antd";

export default {
    title: "Feedback/ConfirmModal",
    component: ConfirmModal,
};

export const confirmModal = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <ConfirmModal
                heading="Modal Heading"
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                visible={visible}
            />
        </>
    );
};

export const withForm = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <ConfirmModal
                heading="Modal Heading"
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                visible={visible}
            >
                <Radio value={1} className="confirmbox__radio">
                    One
                </Radio>
                <Radio value={2} className="confirmbox__radio">
                    Two
                </Radio>
            </ConfirmModal>
        </>
    );
};
