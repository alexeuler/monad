from monad import Monad

class Option(Monad):
  def pure(self, x):
    return Some(x)

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

# print(Some(1).map(lambda x: x + 1).value)
# print(Some(1).flat_map(lambda x: nil).value)
# print(Some(1).flat_map(lambda x: Some(x + 3)).value)
# print(nil.map(lambda x: x + 1).defined)
