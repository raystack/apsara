// The entry point of "@raystack/apsara/icons": the icons, and nothing else.
//
// Prefer this path over the package root when you want icons without the
// component library. The CJS build of the root barrel eagerly requires every one
// of its modules, so pulling a single icon from "@raystack/apsara" loads every
// component too; this barrel reaches no component module at all.

// This block must mirror what the root barrel exports from
// "./icons/create-icon".
//
// Both rollup configs write to dist/icons/, so both emit dist/icons/create-icon.js
// and the later build (./icons) overwrites the earlier one (the root). Rollup
// tree-shakes each build against its own entry point, so anything this barrel
// does not reach is dropped from the shared output file — which silently removed
// IconProvider from the published package until this export was added.
export {
  createIcon,
  type IconComponent,
  type IconOverrides,
  type IconProps,
  IconProvider,
  type IconProviderProps
} from './create-icon';
export * from './generated';
export type { IconName } from './generated/types';
