const path = require("path");
const fs = require("fs").promises;
const camelcase = require("camelcase");

const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const svgr = require("@svgr/core").default;
const babel = require("@babel/core");

const iconDir = path.join(__dirname, "..", "icons");
const esmDir = path.join(__dirname, "..", "esm");
const cjsDir = path.join(__dirname, "..", "cjs");

async function getIcons() {
    let files = await fs.readdir(iconDir);
    return Promise.all(
        files.map(async (file) => {
            const name = file.replace(/\.svg$/, "");
            const exportName = camelcase(name);
            const componentName = `${camelcase(name, { pascalCase: true })}Icon`;
            const svg = await fs.readFile(path.join(iconDir, file), "utf8");
            return {
                svg,
                componentName,
                exportName,
            };
        }),
    );
}

async function transform(svg, componentName, format) {
    const component = await svgr(
        svg,
        {},
        {
            componentName,
        },
    );
    const { code } = await babel.transformAsync(component, {
        plugins: [
            [
                require("@babel/plugin-transform-react-jsx"),
                {
                    useBuiltIns: true,
                },
            ],
        ],
    });
    if (format === "esm") {
        return code;
    }
    return code
        .replace('import * as React from "react"', 'const React = require("react")')
        .replace("export default", "module.exports =");
}

function buildIndex(list, format) {
    const baseImport = format === "esm" ? `import * as React from "react"\n` : `const React = require('react');\n`;
    return list.reduce((acc, { exportName, componentName }) => {
        const content =
            format === "esm"
                ? `import ${componentName} from './${componentName}.js';\nexport const ${exportName} = ${componentName};\n`
                : `const ${componentName} = require('./${componentName}.js');\nmodule.${exportName} = ${componentName};\n`;
        return acc + content;
    }, baseImport);
}

async function writeIndexFiles(componentList) {
    const indexEsmContent = buildIndex(componentList, "esm");
    const indexCjsContent = buildIndex(componentList, "cjs");
    return Promise.all([
        fs.writeFile(`${esmDir}/index.js`, indexEsmContent, "utf8"),
        fs.writeFile(`${cjsDir}/index.js`, indexCjsContent, "utf8"),
    ]);
}

async function writeIconFiles({ esmContent, types, cjsContent, componentName }) {
    return Promise.all([
        fs.writeFile(`${esmDir}/${componentName}.js`, esmContent, "utf8"),
        fs.writeFile(`${esmDir}/${componentName}.d.ts`, types, "utf8"),
        fs.writeFile(`${cjsDir}/${componentName}.js`, cjsContent, "utf8"),
        fs.writeFile(`${cjsDir}/${componentName}.d.ts`, types, "utf8"),
    ]);
}

async function main() {
    try {
        await Promise.all([rimraf(`./esm/*`), rimraf(`./cjs/*`)]);
        await Promise.all([
            fs.mkdir(esmDir, {
                recursive: true,
            }),
            fs.mkdir(cjsDir, {
                recursive: true,
            }),
        ]);
        const icons = await getIcons();

        const componentList = await Promise.all(
            icons.flatMap(async ({ exportName, componentName, svg }) => {
                const esmContent = await transform(svg, componentName, "esm");
                const cjsContent = await transform(svg, componentName, "cjs");
                const types = `import * as React from 'react';\n
          declare function ${componentName}(props: React.ComponentProps<'svg'>): JSX.Element;\n
          export default ${componentName};\n`;
                await writeIconFiles({ esmContent, cjsContent, types, componentName });
                return {
                    exportName,
                    componentName,
                };
            }),
        );
        await writeIndexFiles(componentList);
    } catch (err) {
        console.error(err);
    }
}

main();
