import { describe, expect, it } from 'vitest';
import { fnv1a } from '../hash';

describe('fnv1a', () => {
  it('matches the FNV-1a 32-bit test vectors', () => {
    expect(fnv1a('')).toBe(0x811c9dc5);
    expect(fnv1a('a')).toBe(0xe40c292c);
  });

  it('continues from a previous hash', () => {
    expect(fnv1a('bc', fnv1a('a'))).toBe(fnv1a('abc'));
  });
});
