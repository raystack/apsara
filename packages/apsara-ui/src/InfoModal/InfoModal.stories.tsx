/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from "react";

import InfoModal from "./InfoModal";
import Button from "../Button";
import Radio from "../Radio";

export default {
    title: "Feedback/InfoModal",
    component: InfoModal,
};

export const infoModal = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <InfoModal heading="Modal Heading" onClose={() => setVisible(false)} visible={visible} />
        </>
    );
};

export const withForm = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>
            <InfoModal heading="Modal Heading" onClose={() => setVisible(false)} visible={visible}>
                <Radio value={1} style={{ display: "block" }}>
                    One
                </Radio>
                <Radio value={2} style={{ display: "block" }}>
                    Two
                </Radio>
            </InfoModal>
        </>
    );
};
