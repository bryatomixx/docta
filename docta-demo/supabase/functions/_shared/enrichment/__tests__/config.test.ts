import { it, expect } from 'vitest';
import { getByPath, ATTOM_CONFIG } from '../config.ts';

it('getByPath reads nested values', () => {
  expect(getByPath({ a: { b: { c: 5 } } }, 'a.b.c')).toBe(5);
});

it('getByPath returns undefined for a missing path', () => {
  expect(getByPath({ a: {} }, 'a.b.c')).toBeUndefined();
});

it('getByPath returns undefined when traversing a non-object', () => {
  expect(getByPath({ a: 1 }, 'a.b')).toBeUndefined();
});

it('ATTOM_CONFIG exposes the base URL, endpoint, and configurable AVM path', () => {
  expect(ATTOM_CONFIG.baseUrl).toBe('https://api.gateway.attomdata.com/propertyapi/v1.0.0/');
  expect(ATTOM_CONFIG.endpoint).toBe('allevents/detail');
  expect(ATTOM_CONFIG.paths.avmValue).toBe('avm.amount.value');
});
