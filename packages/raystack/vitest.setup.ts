import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill PointerEvent for jsdom (used by Base UI internally)
if (typeof global.PointerEvent === 'undefined') {
  // @ts-expect-error Minimal polyfill for jsdom
  global.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  };
}
