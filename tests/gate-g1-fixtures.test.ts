import { describe, it, expect } from 'vitest';
import * as tsFixtures from '../src/data/fixtures';

describe('Gate G1: Fixture Equality against source/dist/data.mjs', () => {
  it('TS fixtures deeply equal the prototype data.mjs fixtures', async () => {
    // Dynamic import the untouched source/dist/data.mjs
    const original = await import('../../source/dist/data.mjs');

    expect(tsFixtures.SOURCES).toEqual(original.SOURCES);
    expect(tsFixtures.CITIES).toEqual(original.CITIES);
    expect(tsFixtures.QUESTIONS).toEqual(original.QUESTIONS);
    expect(tsFixtures.STREET).toEqual(original.STREET);
    expect(tsFixtures.PLACES).toEqual(original.PLACES);
    expect(tsFixtures.PULSE).toEqual(original.PULSE);
    expect(tsFixtures.CIRCLES).toEqual(original.CIRCLES);
    expect(tsFixtures.CHAPTERS).toEqual(original.CHAPTERS);
  });
});

