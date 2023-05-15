import React from "react";
import { CSS, VariantProps } from "../../stitches.config";
import { Text } from "../text";

const DEFAULT_TAG = "h1";

type TextSizeVariants = Pick<VariantProps<typeof Text>, "size">;
type HeadingSizeVariants = "1" | "2" | "3";
type HeadingVariants = { size?: HeadingSizeVariants } & Omit<VariantProps<typeof Text>, "size">;
type HeadingProps = React.ComponentProps<typeof DEFAULT_TAG> & HeadingVariants & { css?: CSS; as?: any };

export const Heading = React.forwardRef<React.ElementRef<typeof DEFAULT_TAG>, HeadingProps>((props, forwardedRef) => {
    // '2' here is the default heading size variant
    const { size = "1", ...textProps } = props;
    // This is the mapping of Heading Variants to Text variants
    const textSize: Record<HeadingSizeVariants, TextSizeVariants["size"]> = {
        1: { "@initial": "9" },
        2: { "@initial": "10" },
        3: { "@initial": "11" },
    };

    // This is the mapping of Heading Variants to Text css
    const textCss: Record<HeadingSizeVariants, CSS> = {
        1: { fontWeight: 500 },
        2: { fontWeight: 500 },
        3: { fontWeight: 500 },
    };

    return (
        <Text
            as={DEFAULT_TAG}
            {...textProps}
            ref={forwardedRef}
            size={textSize[size]}
            css={{
                fontVariantNumeric: "proportional-nums",
                ...textCss[size],
                ...props.css,
            }}
        />
    );
});
