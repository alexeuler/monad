import http.client
import threading
import time
import os
from future import Future
from either import Either, Left, Right

conn = http.client.HTTPSConnection("en.wikipedia.org")
sema = threading.BoundedSemaphore(1)

def read_file_sync(uri, cb):
  base_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
  path = os.path.join(base_dir, uri)
  try:
    with open(path) as f:
      data = f.read()
    cb(Right(data))
  except Exception as err:
    cb(Left(err))

def read_file(uri):
  def read_async(cb):
    t = threading.Thread(target=read_file_sync, args=[uri, cb])
    t.start()
  return Future(read_async)

def fetch_sync(uri, cb):
  try:
    conn.request("GET", uri)
    r = conn.getresponse()
    data = r.read().decode("utf-8")
    cb(Right(data))
  except Exception as err:
    cb(Left(err))

def fetch(uri):
  def fetch_async(cb):
    t = threading.Thread(target=fetch_sync, args=[uri, cb])
    t.start()
  return Future(fetch_async)

def fetch_short(uri):
  return fetch(uri).map(lambda res: res[:200])

def main(args=None):
  lines = read_file("../resources/urls.txt").map(lambda res: res.splitlines())
  content = lines.flat_map(lambda urls: Future.traverse(urls)(fetch_short))
  output = content.map(lambda res: print("\n".join(res)))
  output.map(lambda res: sema.release())
  sema.acquire()

if __name__ == "__main__":
  main()