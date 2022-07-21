import Colors from "../Colors";
import {  mauve, blackA, blue} from '@radix-ui/colors';

const fontSizes = ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "72px"];

const base = {
    fontSizes,
};

const light = {
    ...base,
    body:{
        bg : "white",
        color : Colors?.light?.black[9]
    },
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
    states: {
        text: Colors?.light?.black[9],
    },
    confirmModal: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[9],
    },
    infoModal: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[9],
    },
    notification: {
        bg: Colors?.light?.black[0],
        text: Colors?.light?.black[9],
        content: Colors?.light?.black[8],
    },
    contentLayout: {
        sidebarWidth: "310px",
    },
    header: {
        title: Colors?.light?.black[11],
        avatar: Colors?.light?.black[0],
        learn: Colors?.light?.black[4],
        menuBg: Colors?.light?.black[0],
        menuText: Colors?.light?.black[9],
        menuHover: Colors?.light?.black[2],
    },
    sidebar: {
        bg: Colors?.light?.black[2],
        border: Colors?.light?.black[3],
        nav: Colors?.light?.black[8],
        active: Colors?.light?.primary[4],
        trigger: Colors?.light?.black[7],
        title: Colors?.light?.primary[3],
    },
    select:{
        bg:"white",
        label:mauve.mauve11,
        separator:Colors?.light?.primary[1],
        scroll: Colors?.light?.primary[3],
        trigger:{
            color: Colors?.light?.primary[3],
            bg: "white",
            shadow: blackA.blackA7,
            hover: mauve.mauve3
        },
        item:{
            color: Colors?.light?.primary[3],
            disabled:mauve.mauve8,
            focusColor: Colors?.light?.primary[0],
            focusBg: Colors?.light?.primary[3]
        }
    },
    switch:{
        color: "black",
        bg: blackA.blackA9,
        shadow: blackA.blackA7
    },
    radio:{
        disabled:blackA.blackA3,
        hover:blue.blue3,
        focus:blue.blue10,
        shadow:blackA.blackA8,
        label:"black"
    }
};

const dark = {
    ...base,
    body:{
        bg : "black",
        color : Colors?.dark?.black[0]
    },
    colors: Colors?.dark,
    learn: {
        bg: Colors?.dark?.black[9],
        title: Colors?.dark?.black[0],
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
        bg: Colors?.dark?.black[8],
    },
    table: {
        border: Colors?.dark?.black[8],
        empty: Colors?.dark?.black[5],
        heading: Colors?.dark?.black[6],
        text: Colors?.dark?.black[2],
        highlight: Colors?.dark?.black[8],
        title: Colors?.dark?.black[1],
        bg: Colors?.dark?.black[7],
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
    states: {
        text: Colors?.dark?.black[0],
        bg: Colors?.light?.black[8],
    },
    confirmModal: {
        bg: Colors?.dark?.black[8],
        text: Colors?.dark?.black[1],
    },
    infoModal: {
        bg: Colors?.dark?.black[8],
        text: Colors?.dark?.black[1],
    },
    notification: {
        bg: Colors?.dark?.black[9],
        text: Colors?.dark?.black[0],
        content: Colors?.dark?.black[1],
    },
    contentLayout: {
        sidebarWidth: "310px",
    },
    header: {
        title: Colors?.dark?.black[0],
        avatar: Colors?.dark?.black[11],
        learn: Colors?.dark?.black[4],
        menuBg: Colors?.dark?.black[8],
        menuText: Colors?.dark?.black[1],
        menuHover: Colors?.dark?.black[9],
    },
    sidebar: {
        bg: Colors?.dark?.black[9],
        border: Colors?.dark?.black[8],
        nav: Colors?.dark?.black[3],
        active: Colors?.dark?.primary[2],
        trigger: Colors?.dark?.black[5],
        title: Colors?.dark?.primary[1],
    },
    select:{
        bg: "#065656",
        label:"#C1FAFA",
        separator:"black",
        scroll: "#48EEF3",
        trigger:{
            color:  "#48EEF3",
            bg: "#065656",
            shadow: blackA.blackA7,
            hover: "#064D4D"
        },
        item:{
            color: "#48EEF3",
            disabled:mauve.mauve8,
            focusColor: "#48EEF3",
            focusBg: "black"
        }
    },
    switch:{
        color: "#065656",
        bg: Colors.dark.black[5],
        shadow: blackA.blackA7
    },
    radio:{
        disabled:Colors.dark.black[2],
        hover:blue.blue3,
        focus:"#065656",
        shadow:"#48EEFF",
        label:"white",
    }
};

const Themes = {
    light,
    dark,
};

export default Themes;
