package object monad {
  implicit val MyOptionMonad = new Monad[MyOption] {
    def pure[A](a: A) = MySome(a)
    def flatMap[A, B](ma: MyOption[A])(f: A => MyOption[B]): MyOption[B] = ma match {
      case MyNone => MyNone
      case MySome(a) => f(a)
    }
  }
}
