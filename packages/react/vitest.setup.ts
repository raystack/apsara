import '@testing-library/jest-dom/vitest';

// A test that sets `@vitest-environment node` has no DOM to polyfill.
if (typeof window !== 'undefined') {
  // Polyfill ResizeObserver for tests
  global.ResizeObserver = class ResizeObserver {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  };

  const emptyRectList = () => [] as unknown as DOMRectList;

  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = emptyRectList;
  }
  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0);
  }
  if (!Element.prototype.getClientRects) {
    Element.prototype.getClientRects = emptyRectList;
  }
  if (!document.elementFromPoint) {
    document.elementFromPoint = () => null;
  }
}
