import monad._

object Main extends App {
  println(MySome(1).map(_ + 2))
  println(MySome(1).flatMap(_ => MyNone))
  println(MyLeft(1).flatMap(_ => MyRight(2)))
  println(MyRight(1).map(_ + 10))
}