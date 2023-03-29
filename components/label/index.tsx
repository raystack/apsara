import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "~/stitches.config";
import { Text } from "../text";

export const Label = styled(LabelPrimitive.Root, Text, {
    display: "inline-block",
    verticalAlign: "middle",
    cursor: "default",
});
