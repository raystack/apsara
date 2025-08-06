import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import postcssImport from 'postcss-import';
import postcss from 'rollup-plugin-postcss';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

const createPlugins = ({ rootDir, declarationDir }) => [
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
  image()
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
    external: id => {
      return (
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') || // e.g. react/jsx-runtime
        id.includes('react/jsx-runtime') // explicitly avoid virtual chunking
      );
    },
    plugins: createPlugins({
      rootDir: conf.inputPath,
      declarationDir: conf.outputPath
    }),
    onwarn: sharedWarningHandler
  };
});

export default rollupConfig;
