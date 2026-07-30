/// <reference types="vitest" />
import svgr from '@svgr/rollup';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
