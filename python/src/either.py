from monad import Monad

class Either(Monad):
  @staticmethod
  def pure(value):
    return Right(value)

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

# print(Either.pure(1).map(lambda x: x + 3).is_left)
# print(Either.pure(1).map(lambda x: x + 3).value)
# print(Left(1).map(lambda x: x + 3).is_left)
# print(Left(1).map(lambda x: x + 3).value)
# print(Left(1).flat_map(lambda x: Right(x + 3)).is_left)
# print(Left(1).flat_map(lambda x: Right(x + 3)).value)