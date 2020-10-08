const path = require("path");
const Theme = require("./theme");

module.exports = {
    stories: ["../packages/**/*.stories.[tj]sx"],
    addons: ["@storybook/addon-actions", "@storybook/addon-links"],
    typescript: {
        check: true,
        checkOptions: {},
        reactDocgenTypescriptOptions: {
            propFilter: (prop) => ["label", "disabled"].includes(prop.name),
        },
    },
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve("babel-loader"),
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                        plugins: [
                            ["import", { libraryName: "antd", libraryDirectory: "lib", style: true }],
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                        ],
                    },
                },
                // Automatics props for typescript
                {
                    loader: require.resolve("react-docgen-typescript-loader"),
                },
            ],
        });
        config.module.rules.push({
            test: /\.less$/,
            use: [
                "style-loader",
                "css-loader",
                {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                            modifyVars: Theme,
                        },
                    },
                },
            ],
            include: path.resolve(__dirname, "../"),
        });
        config.resolve.extensions.push(".ts", ".tsx");

        const fileLoaderRule = config.module.rules.find((rule) => rule.test.test(".svg"));
        fileLoaderRule.exclude = /\.svg$/;
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"],
        });
        return config;
    },
};
