class Monad {
  // pure :: a -> M a
  pure = () => { throw "pure method needs to be implemented" }
  
  // flatMap :: # M a -> (a -> M b) -> M b
  flatMap = (x) => { throw "flatMap method needs to be implemented" }

  // map :: # M a -> (a -> b) -> M b
  map = f => this.flatMap(x => new this.pure(f(x)))
}

export default Monad;
