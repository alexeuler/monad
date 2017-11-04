package object monad {
  implicit val MyOptionMonad = new Monad[MyOption] {
    def pure[A](a: A) = MySome(a)
    def flatMap[A, B](ma: MyOption[A])(f: A => MyOption[B]): MyOption[B] = ma match {
      case MyNone => MyNone
      case MySome(a) => f(a)
    }
  }

  implicit def MyEitherMonad[E] = new Monad[MyEither[E, ?]] {
    def pure[A](a: A) = MyRight(a)

    // def flatMap[EE >: E, A, B](mb: MyEither[EE, A])(f: A => MyEither[EE, B]): MyEither[EE, B] = mb match {
    //   case MyLeft(a) => MyLeft(a)
    //   case MyRight(b) => f(b)
    // }

    def flatMap[A, B](mb: MyEither[E, A])(f: A => MyEither[E, B]): MyEither[E, B] = mb match {
      case MyLeft(a) => MyLeft(a)
      case MyRight(b) => f(b)
    }
  }
}
