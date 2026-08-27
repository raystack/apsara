import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  createIcon,
  type IconOverrides,
  type IconProps,
  IconProvider
} from '../create-icon';

// `createIcon` is public so that a consumer can build an icon Apsara does not
// ship and have it behave like one that Apsara does. This file is the only
// cover that contract has: `icons/icons.tsx` only ever passes keys inside the
// set, so nothing else here calls the factory the way a consumer does.
//
// It imports nothing outside `icons/`: the `./icons` rollup build sets `rootDir`
// to this directory, and an import of a component would make the TypeScript
// program warn (TS6059).

/** A drawing, standing in for whatever library the consumer pulls from. */
const Rocket = (props: IconProps) => (
  <svg {...props} data-testid='rocket'>
    <title>rocket</title>
  </svg>
);

/** The one line a consumer writes in their own `src/icons.ts`. */
const RocketIcon = createIcon('RocketIcon', Rocket);

describe('createIcon, for a key Apsara does not ship', () => {
  it('applies the base props', () => {
    render(<RocketIcon />);

    const icon = screen.getByTestId('rocket');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
    expect(icon).toHaveAttribute('stroke-width', '1.5');
  });

  it('stamps data-icon with the name it was given', () => {
    render(<RocketIcon />);

    expect(screen.getByTestId('rocket')).toHaveAttribute(
      'data-icon',
      'RocketIcon'
    );
  });

  it('sets displayName to the name it was given', () => {
    expect(RocketIcon.displayName).toBe('RocketIcon');
  });

  it('takes the props from the provider', () => {
    render(
      <IconProvider props={{ strokeWidth: 2, width: 24 }}>
        <RocketIcon />
      </IconProvider>
    );

    const icon = screen.getByTestId('rocket');
    expect(icon).toHaveAttribute('stroke-width', '2');
    expect(icon).toHaveAttribute('width', '24');
  });

  it('lets the props at the call site beat the provider props', () => {
    render(
      <IconProvider props={{ strokeWidth: 2 }}>
        <RocketIcon strokeWidth={3} />
      </IconProvider>
    );

    expect(screen.getByTestId('rocket')).toHaveAttribute('stroke-width', '3');
  });

  it('is not replaceable by key in TypeScript', () => {
    const Override = (props: IconProps) => (
      <svg {...props} data-testid='override' />
    );

    // `components` is typed to the keys Apsara ships, so naming a key it does
    // not ship is a type error, not a silent no-op. `tsc --noEmit` is what
    // asserts this line — if the key ever became assignable, the unused
    // `@ts-expect-error` would itself fail the type check.
    // @ts-expect-error — RocketIcon is not one of Apsara's keys.
    const overrides: IconOverrides = { RocketIcon: Override };

    render(
      <IconProvider components={overrides}>
        <RocketIcon />
      </IconProvider>
    );

    // The lookup is by string, so the entry does reach the wrapper at runtime.
    // The type is the whole guard: a consumer who owns the file that defines an
    // icon does not need the context to reach it, and Apsara does not promise
    // that it will.
    expect(screen.getByTestId('override')).toHaveAttribute(
      'data-icon',
      'RocketIcon'
    );
  });
});
