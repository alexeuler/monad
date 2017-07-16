import Monad from './monad';

export class Either extends Monad {
  // pure :: a -> M a
  pure = (value) => {
    return new Right(value)
  }

  // flatMap :: # M a -> (a -> M b) -> M b
  flatMap = f => 
    this.constructor.name === 'Left' ? 
    this : 
    f(this.value)

}

export class Left extends Either {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return `Left(${this.value})`
  }
}

export class Right extends Either {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return `Right(${this.value})`
  }
}

// attempt :: (() -> a) -> M a 
Either.attempt = f => {
    try {
      return new Right(f())
    } catch(e) {
      return new Left(e)
    }
}
Either.pure = (new Left(null)).pure
