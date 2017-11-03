import monad._

object Main extends App {
  println(MySome(1).map(_ + 2))
  println(MySome(1).flatMap(_ => MyNone))
}