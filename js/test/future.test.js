import { Future } from '../src/future';
import { Either, Left, Right } from '../src/either';
import https from 'https';

describe('Future', () => {
  describe('pure', () => {
    it('creates immediately executed function', () => {
      return Future.pure(20).toPromise().then(x => expect(x).toBe(20))
    });
  });

  describe('async', () => {
    it('wraps node funtion into future', () => {
      const success = (x, cb) => cb(null, x)
      return Future.async(success, 'OK').map(x => expect(x).toBe('OK')).toPromise();
    });

    it('returns failed promise if node function fails', () => {
      const fail = (err, cb) => cb(err, null)
      return Future.async(fail, 'FAIL').map(x => x).toPromise().catch(e => expect(e).toBe('FAIL'));
    });
  });

  describe('traverse', () => {
    it('traverses list of futures', () => {
      Future.traverse([1, 2, 3])(x => Future.pure(x)).toPromise().then(list => expect(list).toEqual([1,2,3]))
    })
  })
});