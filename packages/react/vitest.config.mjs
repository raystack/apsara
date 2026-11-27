/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

// These files need a child process: the bundle tests load Rolldown's native
// binding, and the others set process.env.TZ, which a worker thread does not
// apply. Add any test that sets process.env.TZ here.
const forkOnly = [
  'components/data-view/__tests__/filter-operations.test.ts',
  'components/editor/__tests__/bundle.test.ts',
  'components/filter-chip/__tests__/filter-chip.test.tsx',
  'icons/__tests__/bundle.test.ts',
  'shared/__tests__/date-filters.test.ts'
];

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'stable'
      }
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'vm',
          // One jsdom per worker, with each file in its own VM context.
          pool: 'vmThreads',
          exclude: [...configDefaults.exclude, ...forkOnly]
        }
      },
      {
        extends: true,
        test: { name: 'forks', pool: 'forks', include: forkOnly }
      }
    ]
  },
  resolve: {
    alias: {
      '~/': new URL('./', import.meta.url).pathname
    }
  }
});
