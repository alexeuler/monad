package monad

sealed trait MyOption[+A] {
  def flatMap[B](f: A => MyOption[B])(implicit M: Monad[MyOption]): MyOption[B] =
    M.flatMap(this)(f)

  def map[B](f: A => B)(implicit M: Monad[MyOption]): MyOption[B] =
    M.map(this)(f)
}
case object MyNone extends MyOption[Nothing]
case class MySome[A](x: A) extends MyOption[A]
