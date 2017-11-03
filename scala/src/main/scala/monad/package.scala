package object monad {
  implicit val maybeMonad = new Monad[Maybe] {
    def pure[A](a: A) = Just(a)
    def flatMap[A, B](ma: Maybe[A])(f: A => Maybe[B]): Maybe[B] = ma match {
      case Nothing() => Nothing()
      case Just(a) => f(a)
    }
  }
}
