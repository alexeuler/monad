from monad import Monad
from option import nil, Some
from either import Either
from functools import reduce

class Future(Monad):
  def __init__(self, f):
    self.subscribers = []
    self.cache = nil
    f(self.callback)

  @staticmethod
  def pure(value):
    return Future(lambda cb: cb(Either.pure(value)))

  def flat_map(self, f):
    return Future(
      lambda cb: self.subscribe(
        lambda value: cb(value) if (value.is_left) else f(value.value).subscribe(cb)
      )
    )

  def traverse(arr):
    return lambda f: reduce(
      lambda acc, elem: acc.flat_map(
        lambda values: f(elem).map(
          lambda value: values + [value]
        )
      ), arr, Future.pure([]))

  def callback(self, value):
    self.cache = Some(value)
    while (len(self.subscribers) > 0):
      sub = self.subscribers.pop(0)
      sub(value)
  
  def subscribe(self, subscriber):
    if (self.cache.defined):
      subscriber(self.cache.value)
    else:
      self.subscribers.append(subscriber)