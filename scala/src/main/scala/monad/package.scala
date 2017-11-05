package object monad {
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
