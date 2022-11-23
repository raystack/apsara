import React from "react";
import { ListSkeleton, EditorSkeleton, DetailsSkeleton } from "./Skeleton";

export default {
    title: "Feedback/Skeleton",
    component: ListSkeleton,
};
export const listloader = () => <ListSkeleton />;
export const editorLoader = () => <EditorSkeleton lastLineWidth="80%" />;
export const detailsloader = () => <DetailsSkeleton />;
