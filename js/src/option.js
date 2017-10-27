import Monad from './monad';

export class Option extends Monad {
  // pure :: a -> Option a
  pure = (value) => {
    if ((value === null) || (value === undefined)) {
      return none;
    }
    return new Some(value)
  }

  // flatMap :: # Option a -> (a -> Option b) -> Option b
  flatMap = f => 
    this.constructor.name === 'None' ? 
    none : 
    f(this.value)

  // equals :: # M a -> M a -> boolean
  equals = (x) => this.toString() === x.toString()
}

class None extends Option {
  toString() {
    return 'None';
  }
}
// Cached None class value
export const none = new None()
Option.pure = none.pure

export class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return `Some(${this.value})`
  }
}