from monad import Monad

class Option(Monad):
  # pure :: a -> Option a
  @staticmethod
  def pure(x):
    return Some(x)

  # flat_map :: # Option a -> (a -> Option b) -> Option b
  def flat_map(self, f):
    if self.defined:
      return f(self.value)
    else:
      return nil


class Some(Option):
  def __init__(self, value):
    self.value = value
    self.defined = True

class Nil(Option):
  def __init__(self):
    self.value = None
    self.defined = False

nil = Nil()
