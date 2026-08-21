'use client';

import {
  type ComponentType,
  createContext,
  type ReactNode,
  type SVGProps,
  useContext,
  useMemo,
  useRef
} from 'react';
import type { IconName } from './types';

/**
 * The props of an Apsara icon: the SVG attributes, without `children`.
 *
 * An icon draws a fixed shape, so it takes no children. Leaving `children` out
 * is also what keeps a real icon library assignable to `IconComponent`: props
 * are contravariant, so an override has to accept every prop this type permits,
 * and some libraries declare `children?: undefined` to forbid children.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;
export type IconComponent = ComponentType<IconProps>;
export type IconOverrides = Partial<Record<IconName, IconComponent>>;

/**
 * The icons and the icon props together, so `<Theme icons>` takes one object.
 *
 * `components` replaces a drawing by key. `props` applies to every icon built
 * by `createIcon`, the consumer's own included.
 */
export interface IconOptions {
  components?: IconOverrides;
  props?: IconProps;
}

/** What `createIcon` reads: the override map, and the shared props. */
export interface IconContextValue {
  icons?: IconOverrides;
  props?: IconProps;
}

// The context holds overrides only, never the defaults. A merged
// `{ ...defaultIcons, ...icons }` map here would make this module reference
// every icon, and no bundler could then drop the unused ones. Each wrapper
// closes over its own default instead.
const IconContext = createContext<IconContextValue>({});

function shallowEqual(a?: object, b?: object): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(k => (a as never)[k] === (b as never)[k]);
}

// Hold the last value that passed a shallow compare, so an inline object
// literal at the call site keeps its identity and the context value stays
// stable. The result depends only on the input, so StrictMode and concurrent
// rendering are safe.
function useStable<T extends object | undefined>(value: T): T {
  const ref = useRef(value);
  if (!shallowEqual(ref.current, value)) ref.current = value;
  return ref.current;
}

export interface IconProviderProps extends IconOptions {
  children: ReactNode;
}

export function IconProvider({
  components,
  props,
  children
}: IconProviderProps) {
  const parent = useContext(IconContext);
  const stableIcons = useStable(components);
  const stableProps = useStable(props);

  // Layer on the parent, so a nested provider changes only the keys it names
  // and inherits the rest — the way `Scoped` layers theme tokens. Only supplied
  // maps are merged, never the defaults, so an icon nobody overrides stays
  // absent from the context and removable by a bundler.
  const value = useMemo(
    () => ({
      icons: parent.icons ? { ...parent.icons, ...stableIcons } : stableIcons,
      props: parent.props ? { ...parent.props, ...stableProps } : stableProps
    }),
    [parent.icons, parent.props, stableIcons, stableProps]
  );
  return <IconContext value={value}>{children}</IconContext>;
}

IconProvider.displayName = 'IconProvider';

/**
 * Builds an Apsara icon: a wrapper that applies the base props, stamps
 * `data-icon`, and lets a `<Theme icons>` above it swap the drawing.
 *
 * Use it for an icon Apsara does not ship, and it behaves like the ones it does:
 *
 * ```tsx
 * // src/icons.ts
 * import { createIcon } from '@raystack/apsara/icons';
 * import { Rocket } from 'lucide-react';
 *
 * export const RocketIcon = createIcon('RocketIcon', Rocket);
 * ```
 *
 * `name` is any string. `IconName` covers the keys Apsara ships, so those are
 * the ones `<Theme icons>` can replace with types on your side — but every icon
 * built here reads the same context, so its `props` reach yours too.
 *
 * Resolution: the override from the context, then `Default`.
 * Prop priority: the base values, then the provider `props`, then the props at
 * the call site.
 */
export function createIcon(name: string, Default: IconComponent) {
  const Icon = (callProps: IconProps) => {
    const { icons, props } = useContext(IconContext);
    // `name` is a plain string, so the cast only satisfies the index type. A
    // name with no override in the context misses and falls back to `Default`.
    const Resolved = icons?.[name as IconName] ?? Default;
    return (
      // `strokeWidth` counts units of the icon's own viewBox, and lucide draws
      // in a 24-unit box, so the rendered stroke is `strokeWidth * width / 24`.
      // The design draws a 1px stroke in a 16px frame, which is 1.5 here — not
      // 1, which would render a 0.67px stroke.
      <Resolved
        width={16}
        height={16}
        strokeWidth={1.5}
        {...props}
        {...callProps}
        data-icon={name}
      />
    );
  };
  Icon.displayName = name;
  return Icon;
}
