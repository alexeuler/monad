import scala.io.Source
import java.util.concurrent.Semaphore
import monad._

object Main extends App {
  val semaphore = new Semaphore(0)

  def readFile(name: String): MyFuture[List[String]] =
    MyFuture.async[String, List[String]](filename => Source.fromResource(filename).getLines.toList, name)
  
  def fetch(url: String): MyFuture[String] =
    MyFuture.async[String, String](
      uri => Source.fromURL(uri).mkString.substring(0, 200),
      url
    )
  
  val future = for {
    urls <- readFile("urls.txt")
    entries <- MyFuture.traverse(urls)(fetch _)
  } yield { 
    println(entries)
    semaphore.release
  }

  semaphore.acquire
}