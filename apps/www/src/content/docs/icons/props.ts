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
 * A partial map of icon key to replacement component. Every key is optional, so
 * a map that names one icon changes that icon only. In the package this is
 * `Partial<Record<IconName, IconComponent>>` — typed to the 31 keys Apsara
 * ships, so a typo is a type error.
 */
export type IconOverrides = Partial<Record<string, IconComponent>>;

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
