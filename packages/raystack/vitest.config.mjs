/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    /* Pinned so date tests do not depend on the machine's zone. Without it the
       suite fails east of UTC+9, where a local-midnight year 10000 is still
       year 9999 in UTC. CI passes only because its runners are UTC. */
    env: { TZ: 'UTC' },
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
