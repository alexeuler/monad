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

  def flatMap[B](f: A => MyFuture[B]): MyFuture[B] =
    Monad[MyFuture].flatMap(this)(f)

  def map[B](f: A => B): MyFuture[B] =
    Monad[MyFuture].map(this)(f)

  def callback(value: MyEither[Exception, A]): Unit = {
    semaphore.acquire
    cache = MySome(value)
    subscribers.foreach { sub =>
      val t = new Thread(
        new Runnable {
          def run: Unit = {
            sub(value)
          }
        }
      )
      t.start
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

object MyFuture {
  def async[B, C](f: B => C, arg: B): MyFuture[C] =
    new MyFuture[C]({ cb =>
      val t = new Thread(
        new Runnable {
          def run: Unit = {
            try {
              cb(MyRight(f(arg)))
            } catch {
              case e: Exception => cb(MyLeft(e))
            }
          }
        }
      )
      t.start
    })

  def traverse[A, B](list: List[A])(f: A => MyFuture[B]): MyFuture[List[B]] = {
    list.foldRight(Monad[MyFuture].pure(List[B]())) { (elem, acc) =>
      Monad[MyFuture].flatMap(acc) ({ values =>
        Monad[MyFuture].map(f(elem)) { value => value :: values }
      })
    }
  }
}