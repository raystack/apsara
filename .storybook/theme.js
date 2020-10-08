const WHITE = "#FFFFFF";
const BG_GREY = "#F5F7F8";
const BG_GREY_1 = "#F2F2F2";
const BLACK = "#000000";
const BLACK_1 = "#101d35";
const BORDER_COLOR = "#E5E5E5";
const OUTLINE_COLOR = "#999999";
const PRIMARY_COLOR = "#4d85f4";
const WARNING_COLOR = "#ecad4b";
const SUCCESS_COLOR = "#3ac581";
const ERROR_COLOR = "#F1456C";

module.exports = {
    // Colors
    "@blue-6": PRIMARY_COLOR,
    "@green-6": SUCCESS_COLOR,
    "@red-6": ERROR_COLOR,
    "@gold-6": WARNING_COLOR,

    // TEXT COLOR
    "@text-color": `fade(${BLACK}, 70%)`,
    "@heading-color": `fade(${BLACK}, 70%)`,

    "@background-color-light": "#F5F5F5",
    "@background-color-base": "#F5F5F5",

    "@font-family": "MaisonNeue",

    // Layout
    "@layout-body-background": "transparent",
    "@layout-header-background": WHITE,

    // Outline
    "@outline-color": OUTLINE_COLOR,

    // list items or table cells.
    "@item-hover-bg": BG_GREY,
    "@item-active-bg": BG_GREY,

    // MENU
    "@menu-item-font-size": "12px",
    "@menu-item-active-bg": "transparent",

    // BUTTON
    "@btn-height-lg": "45px",
    "@btn-padding-lg": "0 40px",
    "@padding-xl": "40px",
    "@btn-shadow": "none",
    "@btn-padding-horizontal-base": "12px",
    "@btn-primary-shadow": "none",
    "@btn-text-shadow": "none",

    // TOOLTIP
    "@tooltip-bg": BLACK_1,

    // TABLE
    "@table-header-color": `fade(${BLACK}, 40%)`,
    "@table-header-bg": WHITE,
    "@table-header-sort-bg": WHITE,
    "@table-body-sort-bg": WHITE,
    "@table-row-hover-bg": BG_GREY,
    "@table-header-sort-active-bg": WHITE,
    "@table-header-filter-active-bg": WHITE,

    // BORDER
    "@border-radius-base": "2px",
    "@border-color-base": BORDER_COLOR,
    "@border-color-base-light": BG_GREY_1,
    "@border-color-split": BORDER_COLOR,

    // FORM
    "@input-height-base": "35px",
    "@input-height-sm": "32px",
    "@input-hover-border-color": OUTLINE_COLOR,
    "@input-disabled-bg": WHITE,

    // SIZE
    "@size-xs": "11px",
    "@size-sm": "12px",
    "@size-md": "14px",
    "@size-lg": "16px",
    "@size-xl": "18px",
    "@size-xxl": "20px",
    "@size-xxxl": "25px",
    "@size-large": "28px",
    "@size-xlarge": "32px",
    "@size-xxlarge": "36px",
    "@size-xxxlarge": "40px",
    "@size-big": "48px",
    "@size-bigger": "60px",

    // CUSTOM NON ANTD
    "@datlantis-black-1": BLACK_1,
    "@query-editor-bg": BG_GREY_1,
    "@datlantis-font-sm": "12px",
    "@datlantis-font-md": "14px",
    "@datlantis-font-lg": "16px",
    "@datlantis-font-xl": "20px",
    "@datlantis-size-sm": "8px",
    "@datlantis-size-md": "16px",
    "@datlantis-size-lg": "24px",
    "@datlantis-size-xl": "32px",
    "@datlantis-size-xxl": "40px",

    "@datlantis-icon-font-size-sm": "16px",
    "@datlantis-icon-font-size-md": "20px",
    "@datlantis-icon-font-size-lg": "24px",
    "@datlantis-icon-font-size-xl": "32px",
    "@datlantis-icon-font-size-xxl": "48px",

    "@datlantis-skeleton-bg-color-1": BG_GREY,
    "@datlantis-skeleton-bg-color-2": BG_GREY_1,

    "@datlantis-bg-color": WHITE,

    "@datlantis-right-sidebar-width": "310px",

    "@datlantis-logger-text-color": "#bae67e",
    "@datlantis-logger-bg-color": BLACK_1,

    "@datlantis-form-width": "308px",
    "@datlantis-close-icon-color": "#cccccc",

    //
};
