import type * as Stitches from "@stitches/react";
import { createStitches } from "@stitches/react";

export const { styled, css, theme, createTheme, getCssText, globalCss, keyframes, config, reset } = createStitches({
    prefix: "apsara",
    theme: {
        colors: {
            // apsara white theme
            // forground
            fgBase: "#3C4347",
            fgMuted: "#687076",
            fgSubtle: "#7E868C",
            fgInverted: "#FBFCFD",
            fgAccent: "#3E63DD",
            fgAttention: "#FFB224",
            fgDanger: "#E5484D",
            fgSuccess: "#30A46C",

            // background
            bgBase: "#FBFCFD",
            bgBaseHover: "#F1F3F5",
            bgInset: "#F1F3F5",
            bgInsetHover: "#E6E8EB",
            bgSubtle: "#F8F9FA",
            bgHighlight: "#889096",
            bgInverted: "#3C4347",
            bgAccent: "#E6EDFE",
            bgAccentInverted: "#3E63DD",
            bgAccentInvertedHover: "#3A5CCC",
            bgAttention: "#FFECBC",
            bgAttentionInverted: "#FFB224",
            bgDanger: "#FFE5E5",
            bgDangerInverted: "#E5484D",
            bgDangerInvertedHover: "#DC3D43",
            bgSuccess: "#DDF3E4",
            bgSuccessInverted: "#30A46C",

            // border
            borderBase: "#D7DBDF",
            borderBaseHover: "#C1C8CD",
            borderMuted: "#DFE3E6",
            borderSubtle: "#ECEEF0",
            borderAccent: "#AEC0F5",
            borderAccentInverted: "#3E63DD",
            borderAccentInvertedHover: "#3A5CCC",

            borderAttention: "#3A5CCC",
            borderAttentionInverted: "#FFB224",
            borderDanger: "#F3AEAF",
            borderDangerInverted: "#E5484D",
            borderDangerInvertedHover: "#DC3D43",
            borderSuccess: "#92CEAC",
            borderSuccessInverted: "#30A46C",
        },
        space: {
            1: "4px",
            2: "8px",
            3: "12px",
            4: "16px",
            5: "20px",
            6: "24px",
            7: "28px",
            8: "32px",
            9: "36px",
            10: "52px",
            11: "64px",
        },
        sizes: {
            1: "4px",
            2: "8px",
            3: "12px",
            4: "16px",
            5: "20px",
            6: "24px",
            7: "28px",
            8: "32px",
            9: "36px",
            10: "52px",
            11: "64px",
        },
        radii: {
            1: "4px",
            2: "6px",
            3: "8px",
            4: "12px",
            round: "50%",
            pill: "9999px",
        },
        zIndices: {
            1: "100",
            2: "200",
            3: "300",
            4: "400",
            max: "999",
        },
        fonts: {
            inter: '"Inter", -apple-system, system-ui, sans-serif',
            mono: "Söhne Mono, menlo, monospace",
        },
        fontSizes: {
            1: "11px",
            2: "12px",
            3: "13px",
            4: "14px",
            5: "16px",
            6: "18px",
            7: "20px",
            8: "22px",
            9: "24px",
            10: "28px",
            11: "32px",
            12: "36px",
            13: "45px",
            14: "64px",
        },
        fontWeights: {
            default: 400,
            500: 500,
            600: 600,
            700: 700,
        },
        lineHeights: {
            1: "1.5",
        },
        letterSpacings: {},
        borderWidths: {},
        borderStyles: {},
        shadows: {
            xs: "0px 1px 2px rgba(16, 24, 40, 0.06)",
            sm: "0px 1px 4px rgba(0, 0, 0, 0.09)",
            md: "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
            lg: "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
            xl: "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
        },
        transitions: {},
    },
    media: {
        bp1: "(min-width: 520px)",
        bp2: "(min-width: 900px)",
        bp3: "(min-width: 1200px)",
        bp4: "(min-width: 1800px)",
        motion: "(prefers-reduced-motion)",
        hover: "(any-hover: hover)",
        dark: "(prefers-color-scheme: dark)",
        light: "(prefers-color-scheme: light)",
    },
    utils: {
        px: (value: Stitches.PropertyValue<"paddingLeft">) => ({
            paddingLeft: value,
            paddingRight: value,
        }),
        py: (value: Stitches.PropertyValue<"paddingTop">) => ({
            paddingTop: value,
            paddingBottom: value,
        }),
        mx: (value: Stitches.PropertyValue<"marginLeft">) => ({
            marginLeft: value,
            marginRight: value,
        }),
        my: (value: Stitches.PropertyValue<"marginTop">) => ({
            marginTop: value,
            marginBottom: value,
        }),
        userSelect: (value: Stitches.PropertyValue<"userSelect">) => ({
            WebkitUserSelect: value,
            userSelect: value,
        }),
        size: (value: Stitches.PropertyValue<"width">) => ({
            width: value,
            height: value,
        }),
        appearance: (value: Stitches.PropertyValue<"appearance">) => ({
            WebkitAppearance: value,
            appearance: value,
        }),
        backgroundClip: (value: Stitches.PropertyValue<"backgroundClip">) => ({
            WebkitBackgroundClip: value,
            backgroundClip: value,
        }),
    },
});

export const dark = createTheme("dark", {
    colors: {
        // apsara white theme
        // forground
        fgBase: "#3C4347",
        fgMuted: "#687076",
        fgSubtle: "#7E868C",
        fgInverted: "#FBFCFD",
        fgAccent: "#3E63DD",
        fgAttention: "#FFB224",
        fgDanger: "#E5484D",
        fgSuccess: "#30A46C",

        // background
        bgBase: "#FBFCFD",
        bgBaseHover: "#F1F3F5",
        bgInset: "#F1F3F5",
        bgInsetHover: "#E6E8EB",
        bgSubtle: "#F8F9FA",
        bgHighlight: "#889096",
        bgInverted: "#3C4347",
        bgAccent: "#E6EDFE",
        bgAccentInverted: "#3E63DD",
        bgAccentInvertedHover: "#3A5CCC",
        bgAttention: "#FFECBC",
        bgAttentionInverted: "#FFB224",
        bgDanger: "#FFE5E5",
        bgDangerInverted: "#E5484D",
        bgDangerInvertedHover: "#DC3D43",
        bgSuccess: "#DDF3E4",
        bgSuccessInverted: "#30A46C",

        // border
        borderBase: "#D7DBDF",
        borderBaseHover: "#C1C8CD",
        borderMuted: "#DFE3E6",
        borderSubtle: "#ECEEF0",
        borderAccent: "#AEC0F5",
        borderAccentInverted: "#3E63DD",
        borderAccentInvertedHover: "#3A5CCC",

        borderAttention: "#3A5CCC",
        borderAttentionInverted: "#FFB224",
        borderDanger: "#F3AEAF",
        borderDangerInverted: "#E5484D",
        borderDangerInvertedHover: "#DC3D43",
        borderSuccess: "#92CEAC",
        borderSuccessInverted: "#30A46C",
    },
});

type CSS = Stitches.CSS<typeof config>;
type StitchesConfig = typeof config;
type ScaleValue<TValue> = Stitches.ScaleValue<TValue, StitchesConfig>;
export type { VariantProps } from "@stitches/react";
export type { StitchesConfig, CSS, ScaleValue };
