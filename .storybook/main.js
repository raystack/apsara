const path = require("path");
const Theme = require("./theme");
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

module.exports = {
    stories: ["../packages/**/*.stories.[tj]sx", "../packages/**/*.stories.mdx"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-storysource",
        {
            name: "@storybook/addon-docs",
            options: {
                configureJSX: true,
            },
        },
    ],
    typescript: {
        typescript: {
            check: true,
            checkOptions: {},
            reactDocgen: "react-docgen-typescript",
            reactDocgenTypescriptOptions: {
                shouldExtractLiteralValuesFromEnum: true,
                // propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
                compilerOptions: {
                    allowSyntheticDefaultImports: false,
                    esModuleInterop: false,
                },
            },
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
        config.plugins.push(new TSDocgenPlugin());
        config.resolve.extensions.push(".ts", ".tsx");
        // Replaces the webpack rule that loads SVGs as static files to leave out SVG files for us to handle
        const indexOfRuleToRemove = config.module.rules.findIndex((rule) => rule.test.toString().includes("svg"));
        config.module.rules.splice(indexOfRuleToRemove, 1, {
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
            loader: require.resolve("file-loader"),
            options: {
                name: "static/media/[name].[hash:8].[ext]",
                esModule: false,
            },
        });

        config.module.rules.push({
            test: /.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
};
