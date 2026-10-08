import { describe, expectTypeOf, it } from 'vitest';
import { Radio } from '../radio';

type Plan = 'free' | 'pro';

describe('Radio.Group value types', () => {
  it('defaults to string values', () => {
    <Radio.Group
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<string>()}
    />;
    <Radio.Group
      defaultValue='free'
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<string>()}
    />;
  });

  it('infers the value type from value', () => {
    const value = 'free' as Plan;
    <Radio.Group
      value={value}
      onValueChange={next => expectTypeOf(next).toEqualTypeOf<Plan>()}
    />;
  });

  it('infers number values', () => {
    <Radio.Group
      defaultValue={1}
      onValueChange={value => expectTypeOf(value).toEqualTypeOf<number>()}
    />;
  });

  it('rejects a value outside the type', () => {
    // @ts-expect-error 'team' is not a Plan
    <Radio.Group<Plan> value='team' />;
    // @ts-expect-error value and defaultValue must share one type
    <Radio.Group value={'free' as Plan} defaultValue={1} />;
  });
});
