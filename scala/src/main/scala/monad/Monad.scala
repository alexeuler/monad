package monad

import language.higherKinds

trait Monad[M[_]] {
  def pure[A](a: A): M[A]
  def flatMap[A, B](ma: M[A])(f: A => M[B]): M[B]
  
  def map[A, B](ma: M[A])(f: A => B): M[B] =
    flatMap(ma)(x => pure(f(x)))
}

object Monad {
  def apply[F[_]](implicit M: Monad[F]): Monad[F] = M

  implicit val myOptionMonad = new Monad[MyOption] {
    def pure[A](a: A) = MySome(a)
    def flatMap[A, B](ma: MyOption[A])(f: A => MyOption[B]): MyOption[B] = ma match {
      case MyNone => MyNone
      case MySome(a) => f(a)
    }
  }

  implicit def myEitherMonad[E] = new Monad[MyEither[E, ?]] {
    def pure[A](a: A) = MyRight(a)

    def flatMap[A, B](ma: MyEither[E, A])(f: A => MyEither[E, B]): MyEither[E, B] = ma match {
      case MyLeft(a) => MyLeft(a)
      case MyRight(b) => f(b)
    }
  }

  implicit val myFutureMonad = new Monad[MyFuture] {
    def pure[A](a: A): MyFuture[A] = 
      new MyFuture[A]({ cb => cb(myEitherMonad[Exception].pure(a)) })

    def flatMap[A, B](ma: MyFuture[A])(f: A => MyFuture[B]): MyFuture[B] =
      new MyFuture[B]({ cb =>
        ma.subscribe(_ match {
          case MyLeft(e) => cb(MyLeft(e))
          case MyRight(a) => f(a).subscribe(cb)
        })
      })
  }

}