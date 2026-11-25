// The entry point of "@raystack/apsara/icons": the icons, and nothing else.
//
// Prefer this path over the package root when you want icons without the
// component library. The CJS build of the root barrel eagerly requires every one
// of its modules, so pulling a single icon from "@raystack/apsara" loads every
// component too; this barrel reaches no component module at all.

// Keep this block in step with what the root barrel exports from
// "./icons/create-icon".
export {
  createIcon,
  type IconComponent,
  type IconOptions,
  type IconOverrides,
  type IconProps,
  IconProvider,
  type IconProviderProps
} from './create-icon';
export * from './icons';
export type { IconName } from './types';
