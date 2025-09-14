import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
