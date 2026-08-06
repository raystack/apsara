import { expect } from 'vitest';

/**
 * Helpers for asserting the `data-slot` contract: every element a component
 * renders carries a stable, kebab-case, component-prefixed `data-slot`
 * identifier (e.g. `filter-chip-remove`). Slot names are public API — tests
 * use these helpers so a rename fails loudly.
 */

/** The first element carrying `data-slot={name}`, or null. */
export function getSlot(
  container: ParentNode,
  name: string
): HTMLElement | null {
  return container.querySelector(`[data-slot="${name}"]`);
}

/** All elements carrying `data-slot={name}`. */
export function getAllSlots(
  container: ParentNode,
  name: string
): HTMLElement[] {
  return Array.from(container.querySelectorAll(`[data-slot="${name}"]`));
}

/**
 * Assert every listed slot is present at least once. Pass `document.body`
 * as the container when the component portals content (menus, popovers).
 */
export function expectSlots(container: ParentNode, names: string[]): void {
  const missing = names.filter(name => !getSlot(container, name));
  expect(
    missing,
    `expected data-slot(s) to render: ${missing.join(', ')}`
  ).toEqual([]);
}
