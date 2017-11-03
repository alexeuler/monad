package monad

import language.higherKinds

trait Monad[M[_]] {
  def pure[A](a: A): M[A]
  def flatMap[A, B](ma: M[A])(f: A => M[B]): M[B]
  
  def map[A, B](ma: M[A])(f: A => B): M[B] =
    flatMap(ma)(x => pure(f(x)))
}