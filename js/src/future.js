import Monad from './monad';
import { Either, Left, Right } from './Either';

export class Future extends Monad {
  // constructor :: ((Either err a -> void) -> void) -> Future (Either err a)
  constructor(f) {
    super();
    this.pending = [];
    this.resolved = false;
    this.value = undefined;
    f(this.resolve)
  }

  resolve = (value) => {
    this.resolved = true
    this.value = value
    this.pending.map(cb => cb(value))
  }

  addCallback = (callback) => {
    if (this.resolved) {
      callback(this.value);
      return;
    }
    this.pending.push(callback)
  }

  toPromise = () => new Promise(
    (resolve, reject) =>
      this.addCallback(val => val.isLeft() ? reject(val.value) : resolve(val.value))
  )

  // pure :: a -> Future a
  pure = Future.pure

  // flatMap :: # Future a -> (a -> Future b) -> Future b
  flatMap = f =>
    new Future(
      cb => this.addCallback(value => value.isLeft() ? cb(value) : f(value.value).addCallback(cb))
    )
}

Future.fromNode = (nodeFunction, ...args) => {
  return new Future(cb => 
    nodeFunction(...args, (err, data) => err ? cb(new Left(err)) : cb(new Right(data)))
  );
}

Future.pure = value => new Future(cb => cb(Either.pure(value)))
