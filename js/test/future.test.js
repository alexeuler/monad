import { Future } from '../src/future';
import { readFile } from 'fs';

describe('Future', () => {
  describe('fromNode', () => {
    it('creates Future from node function', () => {
      const future = Future.fromNode(readFile, '../resources/urls.txt')
      // const future = new Future(cb => setTimeout(() => cb(undefined, 20), 1000))
      future.map(console.log)
      return future.toPromise()
    });
  });  
});