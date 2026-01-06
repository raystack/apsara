import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import postcssImport from 'postcss-import';
import nodeExternals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

const createPlugins = ({ rootDir, declarationDir }) => [
  // Externalize all dependencies and peer dependencies
  // This must be placed before nodeResolve() to work correctly
  nodeExternals({
    deps: true,
    devDeps: false,
    peerDeps: true,
    optDeps: true,
    // Note: Include deps with subpaths that need to be externalized in include array.
    // https://github.com/Septh/rollup-plugin-node-externals?tab=readme-ov-file#1-this-plugin-is-smart
    include: [
      'react/jsx-runtime',
      'react-dom/client',
      /^dayjs\/plugin\/.*/,
      /^@radix-ui\/.*/
    ]
  }),
  nodeResolve(),
  commonjs(),
  svgr({
    svgoConfig: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false
            }
          }
        }
      ]
    }
  }),
  postcss({
    plugins: [postcssImport()],
    extract: 'style.css',
    minimize: true,
    autoModules: true, // Auto process files ending with .module.css
    modules: true,
    namedExports: true, // Enable named exports for CSS modules
    exclude: ['normalize.css']
  }),
  postcss({
    plugins: [postcssImport()],
    extract: 'normalize.css',
    minimize: true,
    include: ['normalize.css'],
    exclude: ['**/*.module.css', 'style.css']
  }),
  tsconfigPaths(),
  typescript({
    tsconfig: 'tsconfig.json',
    declaration: true,
    rootDir: rootDir,
    declarationDir: declarationDir
  }),
  image(),
  preserveDirectives() //preserve `use client` directive
];

const sharedWarningHandler = (warning, warn) => {
  // Ignore circular dependency warnings
  // if (warning.code === 'CIRCULAR_DEPENDENCY') return;

  // This ignores the warnings generated during build from
  // CSS module imports which is not standard JS module syntax.
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;

  warn(warning);
};

const configs = [
  {
    inputPath: '.',
    outputPath: 'dist'
  },
  {
    inputPath: './icons',
    outputPath: 'dist/icons'
  },
  {
    inputPath: './hooks',
    outputPath: 'dist/hooks'
  }
];

const rollupConfig = configs.map(conf => {
  return {
    input: conf.inputPath + '/index.tsx',
    output: [
      {
        dir: conf.outputPath,
        format: 'es',
        sourcemap: true,
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: conf.inputPath
      },
      {
        dir: conf.outputPath,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        entryFileNames: '[name].cjs',
        preserveModules: true,
        preserveModulesRoot: conf.inputPath
      }
    ],
    plugins: createPlugins({
      rootDir: conf.inputPath,
      declarationDir: conf.outputPath
    }),
    onwarn: sharedWarningHandler
  };
});

export default rollupConfig;
