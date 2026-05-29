import { it, expect } from 'vitest';
import { parseAddress } from '../address.ts';

it('splits "street, city, ST ZIP"', () => {
  expect(parseAddress('123 Main St, Austin, TX 78701')).toEqual({
    address1: '123 Main St',
    address2: 'Austin, TX 78701',
  });
});

it('collapses whitespace and uppercases the state', () => {
  expect(parseAddress('  123  Main   St ,  austin , tx 78701 ')).toEqual({
    address1: '123 Main St',
    address2: 'austin, TX 78701',
  });
});

it('handles two-part "street, city ST ZIP"', () => {
  expect(parseAddress('500 W 2nd St, Austin TX 78701')).toEqual({
    address1: '500 W 2nd St',
    address2: 'Austin TX 78701',
  });
});

it('best-effort split with no commas treats the last 3 tokens as city/state/zip', () => {
  expect(parseAddress('500 W 2nd St Austin TX 78701')).toEqual({
    address1: '500 W 2nd St',
    address2: 'Austin TX 78701',
  });
});
