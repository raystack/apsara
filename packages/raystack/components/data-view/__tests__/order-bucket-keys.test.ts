import { describe, expect, it } from 'vitest';
import { EMPTY_BUCKET_KEY, orderBucketKeys } from '../utils/order-bucket-keys';

/**
 * `orderBucketKeys` is the single ordering rule shared by `groupData`'s
 * sections and Timeline's field lanes: declared order first, undeclared in
 * first-seen order, the empty bucket last. Both callers treat its output as
 * visible layout, so every clause below is observable API.
 */
describe('orderBucketKeys', () => {
  it('returns first-seen order when nothing is declared', () => {
    expect(orderBucketKeys(['Low', 'High', 'Medium'])).toEqual([
      'Low',
      'High',
      'Medium'
    ]);
  });

  it('emits declared keys in declared order', () => {
    expect(
      orderBucketKeys(['Low', 'High', 'Medium'], ['High', 'Medium', 'Low'])
    ).toEqual(['High', 'Medium', 'Low']);
  });

  it('appends undeclared keys in first-seen order after declared ones', () => {
    expect(
      orderBucketKeys(['Blocked', 'Low', 'High', 'Urgent'], ['High', 'Low'])
    ).toEqual(['High', 'Low', 'Blocked', 'Urgent']);
  });

  it('skips declared keys with no bucket', () => {
    expect(orderBucketKeys(['Low'], ['High', 'Medium', 'Low'])).toEqual([
      'Low'
    ]);
  });

  it('pins the empty bucket last', () => {
    expect(
      orderBucketKeys([EMPTY_BUCKET_KEY, 'Low', 'High'], ['High', 'Low'])
    ).toEqual(['High', 'Low', EMPTY_BUCKET_KEY]);
  });

  it('pins the empty bucket last even when declared earlier', () => {
    expect(
      orderBucketKeys(
        ['Low', EMPTY_BUCKET_KEY, 'High'],
        [EMPTY_BUCKET_KEY, 'High', 'Low']
      )
    ).toEqual(['High', 'Low', EMPTY_BUCKET_KEY]);
  });

  it('pins the empty bucket last with nothing declared', () => {
    expect(orderBucketKeys([EMPTY_BUCKET_KEY, 'Low'])).toEqual([
      'Low',
      EMPTY_BUCKET_KEY
    ]);
  });

  it('emits a repeated declaration once', () => {
    expect(orderBucketKeys(['Low', 'High'], ['High', 'High', 'Low'])).toEqual([
      'High',
      'Low'
    ]);
  });

  it('returns an empty list for no buckets', () => {
    expect(orderBucketKeys([], ['High'])).toEqual([]);
  });
});
