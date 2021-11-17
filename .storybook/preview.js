import React from "react";
import { addDecorator, addParameters } from "@storybook/react";
import sortEachDepth from "./sortEachDepth";
import { Provider, Themes } from "@odpf/apsara";

// Apply global styles for storybook
import "!style-loader!css-loader!less-loader!./storybook.less";
import "../packages/apsara-ui/styles/app.less";

addDecorator((story) => <div style={{ margin: "16px" }}>{story()}</div>);
addParameters({
    options: {
        showRoots: true,
        storySort: sortEachDepth([
            ["Intro", "General", "Navigation", "Data Entry", "Data Display", "..."],
            ["General", "Colors", "Icons", "Button", "Text", "Title", "Input", "..."],
            ["Overview", "...", "_internals"],
        ]),
    },
});

export const parameters = {
    previewTabs: {
        "storybook/docs/panel": { index: -1 },
        docs: {
            hidden: false,
        },
        canvas: {
            title: "Story",
            hidden: false,
        },
    },
    controls: { expanded: true },
    docs: {
        inlineStories: true,
    },
};

const MyThemes = {
    light: Themes.light,
    dark: Themes.dark,
};

// Function to obtain the intended theme
const getTheme = (themeName) => {
    return MyThemes[themeName];
};

export const globalTypes = {
    theme: {
        name: "Theme",
        description: "Global theme for components",
        defaultValue: "light",
        toolbar: {
            icon: "circlehollow",
            // Array of plain string values or MenuItem shape (see below)
            items: Object.keys(MyThemes),
            // Property that specifies if the name of the item will be displayed
            showName: true,
        },
    },
};

const withThemeProvider = (Story, context) => {
    const theme = getTheme(context.globals.theme);
    return (
        <Provider theme={theme}>
            <Story {...context} />
        </Provider>
    );
};

export const decorators = [withThemeProvider];
