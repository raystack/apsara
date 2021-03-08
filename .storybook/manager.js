import { addons } from "@storybook/addons";
import { create } from "@storybook/theming/create";

addons.setConfig({
    theme: create({
        base: "light",
        colorSecondary: "#1890FF",

        // UI
        appBg: "#F8F8F8",
        appBorderColor: "#EDEDED",
        appBorderRadius: 6,

        // Typography
        fontBase: '"Roboto", sans-serif',

        barTextColor: "#1890FF",
        barSelectedColor: "#7D4CDB",
        barBg: "#F2F2F2",

        inputBg: "white",
        inputBorder: "rgba(0,0,0,.1)",
        inputTextColor: "#333333",
        inputBorderRadius: 4,

        brandTitle: "Apsara",
    }),
    showNav: true,
    showPanel: true, // show the code panel by default
});
