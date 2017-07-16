import { Future } from '../src/future';
import https from 'https';

// const get = cb => https.get('https://encrypted.google.com/', (err, res) => {
  
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);
// }
describe('Future', () => {
  describe('pure', () => {
    it('creates immediately executed function', () => {
      return Future.pure(20).toPromise().then(x => expect(x).toBe(20))
    });
  });

  describe('fromNode', () => {
    it('wraps node funtion into future', () => {
      return Future
        .fromNode(https.get, 'https://google.com/')
        .toPromise()
        .then(x => expect(x).toBe(20))
    });
  });
});