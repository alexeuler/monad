import Monad from './monad';

export class Future extends Monad {
  // constructor :: (((err, a) -> void) -> void) -> Future (Either err a)
  constructor(f) {
    super();
    this.pending = [];
    this.resolved = false;
    this.err = null;
    this.data = null;
    f(this.resolve)
  }

  resolve = (err, data) => {
    this.resolved = true
    this.err = err
    this.data = data
    this.pending.map(cb => cb(err, data))
  }

  addCallback = (callback) => {
    if (this.resolved) {
      callback(this.err, this.data);
      return;
    }
    this.pending.push(callback)
  }

  toPromise = () => new Promise((resolve, reject) => this.addCallback(resolve))

  // pure :: a -> Future a
  pure = Future.pure

  // flatMap :: # Future a -> (a -> Future b) -> Future b
  flatMap = f =>
    new Future(
      cb => this.addCallback((err, data) => err ? cb(err, undefined) : f(data).addCallback(cb))
    )
}

Future.fromNode = (nodeFunction, ...args) => {
  const f = nodeFunction.bind(undefined, ...args);
  return new Future(f);
}

Future.pure = value => new Future(cb => cb(undefined, value))
