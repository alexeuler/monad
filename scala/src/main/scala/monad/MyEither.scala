package monad

sealed trait MyEither[+E, +A] {
  def flatMap[EE >: E, B](f: A => MyEither[EE, B])(implicit M: Monad[MyEither[EE, ?]]): MyEither[EE, B] =
    M.flatMap(this)(f)

  def map[EE >: E, B](f: A => B)(implicit M: Monad[MyEither[EE, ?]]): MyEither[EE, B] =
    M.map(this)(f)
  
}
case class MyLeft[E](e: E) extends MyEither[E, Nothing]
case class MyRight[A](a: A) extends MyEither[Nothing, A]