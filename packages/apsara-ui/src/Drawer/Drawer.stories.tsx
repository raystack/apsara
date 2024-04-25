import { useState } from 'react';
import Drawer from './Drawer';

export const Basic = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>Click to open Drawer</button>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
            >
                <p>This is sample drawer content</p>
                <button type="button" onClick={() => console.log('test')}>Test</button>
            </Drawer>
        </>
    );
}

export default {
    title: "Overlay/Drawer",
    component: Drawer,
};