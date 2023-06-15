import * as AvatarPrimitive from "@radix-ui/react-avatar";
import React from "react";
import { CSS, styled, VariantProps } from "~/stitches.config";
import { Box } from "../box";
import { Status } from "../status";

const StyledAvatar = styled(AvatarPrimitive.Root, {
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    userSelect: "none",
    boxSizing: "border-box",
    display: "flex",
    flexShrink: 0,
    position: "relative",
    border: "none",
    fontFamily: "inherit",
    lineHeight: "1",
    margin: "0",
    outline: "none",
    padding: "0",
    fontWeight: "500" as any,
    color: "$fgBase",

    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
    },

    variants: {
        size: {
            sm: {
                width: "$5",
                height: "$5",
            },
            md: {
                width: "$6",
                height: "$6",
            },
            lg: {
                width: "$7",
                height: "$7",
            },
            xl: {
                width: "$8",
                height: "$8",
            },
            "2xl": {
                width: "$9",
                height: "$9",
            },
        },
        shape: {
            square: {
                borderRadius: "$1",
            },
            circle: {
                borderRadius: "50%",
            },
        },
        inactive: {
            true: {
                opacity: ".3",
            },
        },
    },
    defaultVariants: {
        size: "sm",
        shape: "circle",
    },
});

const StyledAvatarImage = styled(AvatarPrimitive.Image, {
    display: "flex",
    objectFit: "cover",
    boxSizing: "border-box",
    height: "100%",
    verticalAlign: "middle",
    width: "100%",
});

const StyledAvatarFallback = styled(AvatarPrimitive.Fallback, {
    textTransform: "uppercase",

    variants: {
        size: {
            sm: {
                fontSize: "12px",
                lineHeight: "16px",
            },
            md: {
                fontSize: "16px",
                lineHeight: "20px",
            },
            lg: {
                fontSize: "20px",
                lineHeight: "24px",
            },
            xl: {
                fontSize: "24px",
                lineHeight: "28px",
            },
            "2xl": {
                fontSize: "28px",
                lineHeight: "32px",
            },
        },
    },
    defaultVariants: {
        size: "sm",
    },
});

const AvatarNestedItem = styled("div", {
    boxShadow: "0 0 0 2px $borderBase",
    borderRadius: "50%",
});

const AvatarGroup = styled("div", {
    display: "flex",
    flexDirection: "row-reverse",
    [`& ${AvatarNestedItem}:nth-child(n+2)`]: {
        marginRight: "-$1",
    },
});

type StatusVariants = React.ComponentProps<typeof Status>;

type AvatarVariants = VariantProps<typeof StyledAvatar>;
type AvatarPrimitiveProps = React.ComponentProps<typeof AvatarPrimitive.Root>;
type AvatarOwnProps = AvatarPrimitiveProps &
    AvatarVariants & {
        css?: CSS;
        alt?: string;
        src?: string;
        fallback?: React.ReactNode;
    };

const AvatarRoot = React.forwardRef<React.ElementRef<typeof StyledAvatar>, AvatarOwnProps>(
    ({ alt, src, fallback, size, shape, css, ...props }, forwardedRef) => {
        return (
            <Box
                css={{
                    ...css,
                    position: "relative",
                    height: "fit-content",
                    width: "fit-content",
                }}
            >
                <StyledAvatar {...props} ref={forwardedRef} size={size} shape={shape}>
                    <StyledAvatarImage alt={alt} src={src} />
                    <StyledAvatarFallback size={size}>{fallback}</StyledAvatarFallback>
                </StyledAvatar>
            </Box>
        );
    },
);

export const Avatar = Object.assign(AvatarRoot, {
    Image: StyledAvatarImage,
    Fallback: StyledAvatarFallback,
    Group: AvatarGroup,
    NestedItem: AvatarNestedItem,
});
