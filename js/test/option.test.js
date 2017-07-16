import { Option, Some, none } from '../src/option';

describe('Option', () => {
  describe('pure', () => {
    it('Returns None for nulls and undefineds and Some for other values', () => {
      expect(Option.pure(null)).toEqual(none);
      expect(Option.pure(undefined)).toEqual(none);
      expect(Option.pure(1).equals(new Some(1))).toBe(true);
    });
  });

  describe('flatMap', () => {
    it('skips mapping if None and does mapping o/w', () => {
      expect(Option.pure(null).flatMap(x => new Some(x + 1))).toEqual(none);
      expect(Option.pure(1).flatMap(x => new Some(x + 2)).equals(new Some(3))).toBe(true);
      expect(Option.pure(1).flatMap(x => none)).toEqual(none);
    });
  });

});