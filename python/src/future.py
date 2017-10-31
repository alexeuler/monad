from monad import Monad
from option import nil, Some
from either import Either, Left, Right
from functools import reduce
import threading

class Future(Monad):
  # __init__ :: ((Either err a -> void) -> void) -> Future (Either err a)
  def __init__(self, f):
    self.subscribers = []
    self.cache = nil
    self.semaphore = threading.BoundedSemaphore(1)
    f(self.callback)

  # pure :: a -> Future a
  @staticmethod
  def pure(value):
    return Future(lambda cb: cb(Either.pure(value)))

  def exec(f, cb):
    try:
      data = f()
      cb(Right(data))
    except Exception as err:
      cb(Left(err))

  def exec_on_thread(f, cb):
    t = threading.Thread(target=Future.exec, args=[f, cb])
    t.start()

  def async(f):
    return Future(lambda cb: Future.exec_on_thread(f, cb))

  # flat_map :: (a -> Future b) -> Future b
  def flat_map(self, f):
    return Future(
      lambda cb: self.subscribe(
        lambda value: cb(value) if (value.is_left) else f(value.value).subscribe(cb)
      )
    )

  # traverse :: [a] -> (a -> Future b) -> Future [b]
  def traverse(arr):
    return lambda f: reduce(
      lambda acc, elem: acc.flat_map(
        lambda values: f(elem).map(
          lambda value: values + [value]
        )
      ), arr, Future.pure([]))

  # callback :: Either err a -> void
  def callback(self, value):
    self.semaphore.acquire()
    self.cache = Some(value)
    while (len(self.subscribers) > 0):
      sub = self.subscribers.pop(0)
      t = threading.Thread(target=sub, args=[value])
      t.start()
    self.semaphore.release()
  
  # subscribe :: (Either err a -> void) -> void
  def subscribe(self, subscriber):
    self.semaphore.acquire()
    if (self.cache.defined):
      self.semaphore.release()
      subscriber(self.cache.value)
    else:
      self.subscribers.append(subscriber)
      self.semaphore.release()