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
 * The props of an Apsara icon. `children` is excluded on purpose: an icon draws
 * a fixed shape, and excluding it is also what makes a real icon library
 * assignable to `IconComponent`.
 *
 * Function component props are contravariant, so an override must accept every
 * prop this type permits. `@radix-ui/react-icons` declares `children?: undefined`
 * to forbid children, so a type that permits `children` rejects every radix
 * icon — which would break the migration map in the documentation.
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

// The context keeps its own field names. `IconProvider` speaks of `components`
// because that reads correctly beside `props` in `<Theme icons>`; the context
// speaks of `icons` because that is what `createIcon` looks an override up in.
export interface IconContextValue {
  icons?: IconOverrides;
  props?: IconProps;
}

// Overrides only. A merged `{ ...defaultIcons, ...icons }` map would make this
// module reference all 31 icons, and no bundler could then remove the unused
// ones. Each wrapper closes over its own default instead.
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

  // Layer on the parent so a nested provider changes only the names it gives
  // and keeps the rest, exactly as `Scoped` layers theme tokens. This merges
  // the maps the consumer supplied — never the defaults — so an icon that
  // nobody overrides is still absent from the context and stays removable by a
  // bundler.
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
 * `icons/icons.tsx` calls this for the 31 icons Apsara ships. It is also
 * public, so an app can give an icon Apsara does not ship the same treatment:
 *
 * ```tsx
 * // src/icons.ts
 * import { createIcon } from '@raystack/apsara/icons';
 * import { Rocket } from 'lucide-react';
 *
 * export const RocketIcon = createIcon('RocketIcon', Rocket);
 * ```
 *
 * `name` is any string. Only the names Apsara ships are in `IconName`, so only
 * those are replaceable through `<Theme icons>` with types on your side — but
 * every icon built here reads the same context, so the `props` of
 * `<Theme icons>` tune yours along with ours.
 *
 * Resolution: the override of the consumer, then `Default`.
 * Prop priority: the base values, then the provider `props`, then the props at
 * the call site.
 */
export function createIcon(name: string, Default: IconComponent) {
  const Icon = (callProps: IconProps) => {
    const { icons, props } = useContext(IconContext);
    // `name` is widened to `string` for consumer-built icons; the lookup is a
    // miss for any name the consumer has not overridden, which is the same
    // outcome as a name Apsara does not ship.
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
