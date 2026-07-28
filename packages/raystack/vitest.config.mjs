/// <reference types="vitest" />
import svgr from '@svgr/rollup';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Components that import an icon from ./icons/assets need the same SVG ->
  // React transform the rollup build uses; 'pre' beats Vite's own asset
  // handling, which would otherwise resolve the .svg to a URL string.
  plugins: [{ ...svgr(), enforce: 'pre' }],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'stable'
      }
    }
  },
  resolve: {
    alias: {
      '~/': new URL('./', import.meta.url).pathname
    }
  }
});
