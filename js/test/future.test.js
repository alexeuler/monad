import { Future } from '../src/future';
import { Either, Left, Right } from '../src/either';
import https from 'https';

// const get = cb => https.get('https://encrypted.google.com/', (err, res) => {
  
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);
// }
describe('Future', () => {
  describe('pure', () => {
    it('creates immediately executed function', () => {
      // return Future.pure(20).toPromise().then(x => expect(x).toBe(20))
    });
  });

  describe('fromNode', () => {
    it('wraps node funtion into future', () => {
      const success = (x, cb) => cb(null, x)
      const fail = (err, cb) => cb(err, null)
      return Future.fromNode(success, 'OK').map(x => expect(x).toBe('OK')).toPromise();
    });

    it('returns failed promise if node function fails', () => {
      const fail = (err, cb) => cb(err, null)
      return Future.fromNode(fail, 'FAIL').map(x => x).toPromise().catch(e => expect(e).toBe('FAIL'));
    });
  });
});