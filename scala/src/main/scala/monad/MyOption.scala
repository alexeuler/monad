package monad

sealed trait MyOption[+A] {
  def flatMap[B](f: A => MyOption[B]): MyOption[B] =
    Monad[MyOption].flatMap(this)(f)

  def map[B](f: A => B): MyOption[B] =
    Monad[MyOption].map(this)(f)
}
case object MyNone extends MyOption[Nothing]
case class MySome[A](x: A) extends MyOption[A]
