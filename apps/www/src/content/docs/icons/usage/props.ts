import type { ComponentType, ReactNode, SVGProps } from 'react';

/**
 * The props of every Apsara icon.
 *
 * `children` is excluded on purpose: an icon draws a fixed shape. Excluding it
 * is also what makes a real icon library assignable to `IconComponent` —
 * `@radix-ui/react-icons`, for one, declares `children?: undefined`.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

/** Any component that can stand in for an Apsara icon. */
export type IconComponent = ComponentType<IconProps>;

/**
 * A partial map of icon name to replacement component. Every key is optional,
 * so a map that names one icon changes that icon only.
 */
export type IconOverrides = Partial<Record<string, IconComponent>>;

export interface IconProviderProps {
  /**
   * Icon components that replace the Apsara defaults, keyed by icon name — for
   * example `{ XIcon: MyX }`. A partial map changes only the icons it names, and
   * a nested provider layers on the one above it, per name.
   */
  icons?: IconOverrides;

  /**
   * Props applied to every icon below this provider — for example
   * `{ strokeWidth: 2 }`. These beat the Apsara base values and lose to the
   * props at the call site.
   */
  props?: IconProps;

  children: ReactNode;
}

export interface ThemeIconProps {
  /**
   * Icon components that replace the Apsara defaults, keyed by icon name.
   * Apsara mounts the icon provider only when this or `iconProps` is set.
   *
   * The map holds functions, so a React Server Component cannot pass it — set it
   * from a client component.
   */
  icons?: IconOverrides;

  /**
   * Props applied to every Apsara icon. The props at the call site still win.
   * Prefer the `data-icon` attribute and CSS where a style rule is enough,
   * because CSS re-renders nothing.
   */
  iconProps?: IconProps;
}
