package monad

sealed trait MyEither[+E, +A] {
  def flatMap[EE >: E, B](f: A => MyEither[EE, B]): MyEither[EE, B] =
    Monad[MyEither[EE, ?]].flatMap(this)(f)

  def map[EE >: E, B](f: A => B): MyEither[EE, B] =
    Monad[MyEither[EE, ?]].map(this)(f)
  
}
case class MyLeft[E](e: E) extends MyEither[E, Nothing]
case class MyRight[A](a: A) extends MyEither[Nothing, A]