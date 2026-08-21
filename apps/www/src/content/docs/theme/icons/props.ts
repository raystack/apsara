// The types the Icons page renders, declared here rather than read from the
// package, as every docs page does. Two notes for whoever edits this file:
//
// - `IconOverrides` is written as an index signature so the tables print the
//   name `IconOverrides`. In the package the key is `IconName`, the union of the
//   keys Apsara ships; a `Record<IconName, …>` here prints as its resolved
//   shape, which reads as though any name works.
// - `ThemeIconProps` has no counterpart in the package. It exists so the tables
//   can show the one icon prop of `<Theme>` beside the rest; the name is never
//   rendered.

import type { ComponentType, ReactNode, SVGProps } from 'react';

/**
 * The props of every Apsara icon.
 *
 * `children` is excluded on purpose: an icon draws a fixed shape. Excluding it
 * is also what makes a real icon library assignable to `IconComponent` — some
 * libraries declare `children?: undefined` to forbid children, and function
 * props are contravariant, so a type that permits `children` would reject them.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

/** Any component that can stand in for an Apsara icon. */
export type IconComponent = ComponentType<IconProps>;

/**
 * A partial map of icon key to replacement component:
 * `Partial<Record<IconName, IconComponent>>`. Every key is optional, so a map
 * that names one icon changes that icon only, and a key Apsara does not ship is
 * a type error.
 */
export type IconOverrides = { [icon: string]: IconComponent | undefined };

/** What `<Theme icons>` takes: the drawings and the props, in one object. */
export interface IconOptions {
  /**
   * Icon components that replace the Apsara defaults, keyed by icon key — for
   * example `{ ErrorIcon: MyError }`. A partial map changes only the keys it
   * names, and a nested `<Theme>` layers on the one above it, per key.
   */
  components?: IconOverrides;

  /**
   * Props applied to every icon built by `createIcon`, your own included — for
   * example `{ strokeWidth: 2 }`. These beat the Apsara base values and lose to
   * the props at the call site.
   */
  props?: IconProps;
}

/** `IconProvider` takes the two halves of `IconOptions` as flat props. */
export interface IconProviderProps extends IconOptions {
  children: ReactNode;
}

/** The icon half of `<Theme>`'s props. */
export interface ThemeIconProps {
  /**
   * The icons inside Apsara's components, and the props applied to every icon.
   * Apsara mounts the icon provider only when one of the two halves is set.
   *
   * The map holds functions, so a React Server Component cannot pass it — set it
   * from a client component.
   */
  icons?: IconOptions;
}
