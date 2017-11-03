package monad

sealed trait Maybe[A]
case class Nothing[A]() extends Maybe[A]
case class Just[A](x: A) extends Maybe[A]

