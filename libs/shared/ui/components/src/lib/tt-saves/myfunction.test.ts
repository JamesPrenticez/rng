import { describe, it, expect } from 'vitest';
import { myfunction } from './myfunction';

describe('myfunction', () => {
  it('returns 100', () => {
    expect(myfunction()).toBe(100);
  });
});
