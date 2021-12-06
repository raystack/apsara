import Colors from "../Colors";

const fontSizes = ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "72px"];

const base = {
    fontSizes,
};

const light = {
    ...base,
    colors: Colors?.light,
    learn: {
        bg: Colors?.light?.black[0],
        title: Colors?.light?.black[9],
        close: Colors?.light?.black[8],
    },
    markdown: {
        text: Colors?.light?.black[8],
        heading: Colors?.light?.black[9],
        link: Colors?.light?.primary[4],
    },
    codeblock: {
        bg: "#101d35",
        text: "#bae67e",
    },
    popover: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[8],
    },
    input: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[10],
        border: Colors?.light?.black[5],
        placeholder: Colors?.light?.black[6],
        hover: Colors?.light?.primary[4],
        disabled: Colors?.light?.black[2],
    },
    tag: {
        bg: Colors?.light?.primary[0],
        text: Colors?.light?.black[10],
        close: Colors?.light?.black[9],
    },
    segments: {
        key: Colors?.light?.black[10],
        value: Colors?.light?.black[7],
        title: Colors?.light?.black[9],
        border: Colors?.light?.black[2],
    },
    table: {
        border: Colors?.light?.black[2],
        empty: Colors?.light?.black[9],
        heading: Colors?.light?.black[6],
        text: Colors?.light?.black[9],
        highlight: Colors?.light?.black[2],
        title: Colors?.light?.black[10],
    },
    listing: {
        filterText: Colors?.light?.black[9],
        filterBorder: Colors?.light?.black[2],
        tableHighlight: Colors?.light?.black[2],
        filterClear: Colors?.light?.black[5],
    },
    tooltip: {
        bg: Colors?.light?.black[11],
        text: Colors?.light?.black[0],
    },
    loader: {
        main: Colors?.light?.black[2],
        active: Colors?.light?.black[3],
    },
    drawer: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[9],
        close: Colors?.light?.black[8],
    },
};

const dark = {
    ...base,
    colors: Colors?.dark,
    learn: {
        bg: Colors?.dark?.black[9],
        text: Colors?.dark?.black[0],
        close: Colors?.dark?.black[5],
    },
    markdown: {
        text: Colors?.dark?.black[5],
        heading: Colors?.dark?.black[0],
        link: Colors?.dark?.primary[1],
    },
    codeblock: {
        bg: Colors?.dark?.black[3],
        text: Colors?.dark?.black[9],
    },
    popover: {
        bg: Colors?.dark?.black[8],
        text: Colors?.dark?.black[1],
    },
    input: {
        bg: Colors?.dark?.black[0],
        text: Colors?.dark?.black[10],
        border: Colors?.dark?.black[5],
        placeholder: Colors?.dark?.black[6],
        hover: Colors?.dark?.primary[4],
        disabled: Colors?.dark?.black[2],
    },
    tag: {
        bg: Colors?.dark?.primary[0],
        text: Colors?.dark?.black[10],
        close: Colors?.dark?.black[9],
    },
    segments: {
        key: Colors?.dark?.black[3],
        value: Colors?.dark?.black[5],
        title: Colors?.dark?.black[1],
        border: Colors?.dark?.black[6],
    },
    table: {
        border: Colors?.dark?.black[8],
        empty: Colors?.dark?.black[5],
        heading: Colors?.dark?.black[6],
        text: Colors?.dark?.black[2],
        highlight: Colors?.dark?.black[8],
        title: Colors?.dark?.black[1],
    },
    listing: {
        filterText: Colors?.dark?.black[2],
        filterBorder: Colors?.dark?.black[7],
        tableHighlight: Colors?.dark?.black[8],
        filterClear: Colors?.dark?.black[6],
    },
    tooltip: {
        bg: Colors?.dark?.black[8],
        text: Colors?.dark?.black[1],
    },
    loader: {
        main: Colors?.dark?.black[8],
        active: Colors?.dark?.black[7],
    },
    drawer: {
        bg: Colors?.dark?.black[9],
        text: Colors?.dark?.black[0],
        close: Colors?.dark?.black[5],
    },
};

const Themes = {
    light,
    dark,
};

export default Themes;
