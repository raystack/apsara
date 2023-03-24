import { dark, globalCss } from "~/stitches.config";

export const globalStyles = globalCss({
    "*, *:before, *:after": {
        margin: 0,
        boxSizing: "border-box",
    },
    "*": {
        margin: 0,
    },
    html: {
        fontSize: "10px",
    },
    "html, body": {
        fontFamily: "$inter",
    },
    body: {
        fontSize: "1.2rem",
        color: "$hiContrast",
        backgroundColor: "$olive1",
        overflowX: "hidden",
        textRendering: "optimizelegibility",
        "-webkit-font-smoothing": "antialiased",
    },
    a: {
        color: "$anchor",
    },

    [`${dark}`]: {},
});

export const ApsaraGlobalStyle = () => {
    globalStyles();
    globalCss({
        "@font-face": [],
        "@import": ["url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap')"],
    })();

    return null;
};
