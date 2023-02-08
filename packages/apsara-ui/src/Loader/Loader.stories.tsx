import React from "react";

import Loader from "./Loader";

export default {
    title: "General/Loader",
    component: Loader,
};

export const loader = () => {
    return <Loader tip="Loading Data" />;
};
