class Monad:
  # pure :: a -> M a
  @staticmethod
  def pure(x):
    raise Exception("pure method needs to be implemented")
  
  # flat_map :: # M a -> (a -> M b) -> M b
  def flat_map(self, f):
    raise Exception("flat_map method needs to be implemented")

  # map :: # M a -> (a -> b) -> M b
  def map(self, f):
    return self.flat_map(lambda x: self.pure(f(x)))
    