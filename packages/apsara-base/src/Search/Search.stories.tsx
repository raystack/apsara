import React from "react";

import Search from "./Search";

export default {
    title: "General/Search",
    component: Search,
};

export const search = () => (
    <>
        <Search className="paddingBottom" />
        <Search value="12345" />
    </>
);
