import Monad from './monad';
import { Either, Left, Right } from './either';
import { none, Some } from './option';

export class Future extends Monad {
  // constructor :: ((Either err a -> void) -> void) -> Future (Either err a)
  constructor(f) {
    super();
    this.subscribers = [];
    this.cache = none;
    f(this.callback)
  }

  // callback :: Either err a -> void
  callback = (value) => {
    this.cache = new Some(value)
    debugger;
    while (this.subscribers.length) {
      const subscriber = this.subscribers.shift();
      subscriber(value)
    }
  }

  // subscribe :: (Either err a -> void) -> void
  subscribe = (subscriber) => 
    (this.cache === none ? this.subscribers.push(subscriber) : subscriber(this.cache.value))

  toPromise = () => new Promise(
    (resolve, reject) =>
      this.subscribe(val => val.isLeft() ? reject(val.value) : resolve(val.value))
  )

  // pure :: a -> Future a
  pure = Future.pure

  // flatMap :: (a -> Future b) -> Future b
  flatMap = f =>
    new Future(
      cb => this.subscribe(value => value.isLeft() ? cb(value) : f(value.value).subscribe(cb))
    )
}

Future.fromNode = (nodeFunction, ...args) => {
  return new Future(cb => 
    nodeFunction(...args, (err, data) => err ? cb(new Left(err)) : cb(new Right(data)))
  );
}

Future.pure = value => new Future(cb => cb(Either.pure(value)))

Future.traverse = list => f =>
  list.reduce(
    (acc, elem) => acc.flatMap(values => f(elem).map(value => [...values, value])), 
    Future.pure([])
  )

