/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
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