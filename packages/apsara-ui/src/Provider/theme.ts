import Colors from "../Colors";

const fontSizes = ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "72px"];

const base = {
    fontSizes,
};

const light = {
    ...base,
    colors: Colors.light,
};

const dark = {
    ...base,
    colors: Colors.dark,
};

const Themes = {
    light,
    dark,
};

export default Themes;
