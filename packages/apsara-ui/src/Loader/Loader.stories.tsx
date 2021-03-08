import React from "react";
import { ListLoader, EditorLoader, DetailsLoader } from "./Loader";

export default {
    title: "Feedback/Loader",
    component: ListLoader,
};
export const listloader = () => <ListLoader />;
export const editorloader = () => <EditorLoader />;
export const detailsloader = () => <DetailsLoader />;
