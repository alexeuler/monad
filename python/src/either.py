from monad import Monad

class Either(Monad):
  # pure :: a -> Either a
  @staticmethod
  def pure(value):
    return Right(value)

  # flatMap :: # Either a -> (a -> Either b) -> Either b
  def flat_map(self, f):
    if self.is_left:
      return self
    else:
      return f(self.value)

class Left(Either):
  def __init__(self, value):
    self.value = value
    self.is_left = True

class Right(Either):
  def __init__(self, value):
    self.value = value
    self.is_left = False
