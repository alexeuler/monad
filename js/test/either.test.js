import { Either, Left, Right } from '../src/either';

describe('Either', () => {
  describe('pure', () => {
    it('Always returns Right', () => {
      expect(Either.pure(null).equals(new Right(null))).toBe(true);
      expect(Either.pure(1).equals(new Right(1))).toBe(true);
    });
  });

  describe('flatMap', () => {
    it('skips mapping for Left and does mapping o/w', () => {
      expect(new Left(1).flatMap(x => new Right(x + 1)).equals(new Left(1))).toBe(true);
      expect(new Right(2).flatMap(x => new Right(x + 1)).equals(new Right(3))).toBe(true);
      expect(new Right(2).flatMap(x => new Left(x + 1)).equals(new Left(3))).toBe(true);
    });
  });
});