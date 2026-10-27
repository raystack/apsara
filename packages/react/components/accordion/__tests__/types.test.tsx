import type { Dispatch, SetStateAction } from 'react';
import { describe, expectTypeOf, it, vi } from 'vitest';
import { Accordion } from '../accordion';

type Section = 'billing' | 'profile';

describe('Accordion value types', () => {
  it('defaults to string values', () => {
    <Accordion
      value='a'
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<string>()}
    />;
    <Accordion
      defaultValue='a'
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<string>()}
    />;
    <Accordion
      multiple
      value={['a']}
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<string[]>()}
    />;
  });

  it('infers the value type in single mode', () => {
    const value = 'billing' as Section;
    <Accordion
      value={value}
      onValueChange={next => expectTypeOf(next).toEqualTypeOf<Section | ''>()}
    />;
  });

  it('infers the value type in multiple mode', () => {
    const value: Section[] = ['billing'];
    <Accordion
      multiple
      value={value}
      onValueChange={next => expectTypeOf(next).toEqualTypeOf<Section[]>()}
    />;
  });

  it('accepts an empty string in controlled single mode', () => {
    const value = '' as Section | '';
    const setValue: Dispatch<SetStateAction<Section | ''>> = vi.fn();
    <Accordion<Section> value={value} onValueChange={setValue} />;
    <Accordion value={value} onValueChange={setValue} />;
  });

  it('accepts non-string values', () => {
    <Accordion
      defaultValue={1}
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<number | ''>()}
    />;
  });

  it('rejects a value outside the type', () => {
    // @ts-expect-error 'other' is not a Section
    <Accordion<Section> value='other' />;
    // @ts-expect-error 'other' is not a Section
    <Accordion<Section> multiple defaultValue={['billing', 'other']} />;
    // @ts-expect-error single mode does not take an array
    <Accordion<Section> value={['billing']} />;
    // @ts-expect-error single mode does not take an array
    <Accordion value={['a', 'b']} />;
  });
});
