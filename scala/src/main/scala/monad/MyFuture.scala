package monad

import java.util.concurrent.Semaphore

class MyFuture[A] {
  private var subscribers: List[MyEither[Exception, A] => Unit] = List()
  private var cache: MyOption[MyEither[Exception, A]] = MyNone
  private val semaphore = new Semaphore(1)

  def this(f: (MyEither[Exception, A] => Unit) => Unit) {
    this()
    f(this.callback _)
  }

  def callback(value: MyEither[Exception, A]): Unit = {
    semaphore.acquire
    cache = MySome(value)
    subscribers.foreach { sub =>
      new Thread {
        new Runnable {
          def run: Unit = {
            sub(value)
          }
        }
      }
    }
    subscribers = List()
    semaphore.release
  }

  def subscribe(sub: MyEither[Exception, A] => Unit): Unit = {
    semaphore.acquire
    cache match {
      case MyNone =>
        subscribers = sub :: subscribers
        semaphore.release
      case MySome(value) =>
        semaphore.release
        sub(value)
    }
  }
}
